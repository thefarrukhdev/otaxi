import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { IDriverLocationEvent } from '@otaxi/types';

interface JoinTripPayload {
  tripId: string;
}

interface DriverLocationPayload {
  tripId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(TrackingGateway.name);

  @WebSocketServer()
  server!: Server;

  // In-memory cache of last known location per trip
  private readonly tripLocations = new Map<string, IDriverLocationEvent>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to tracking socket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from tracking socket: ${client.id}`);
  }

  @SubscribeMessage('trip:join')
  handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinTripPayload,
  ) {
    const { tripId } = payload;
    if (!tripId) return;

    const room = `trip_${tripId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);

    // If we have a cached location for this trip, immediately send it to the joining client
    const lastLocation = this.tripLocations.get(tripId);
    if (lastLocation) {
      client.emit('trip:location', lastLocation);
    }

    return { event: 'trip:joined', tripId };
  }

  @SubscribeMessage('trip:leave')
  handleLeaveTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinTripPayload,
  ) {
    const { tripId } = payload;
    if (!tripId) return;

    const room = `trip_${tripId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);

    return { event: 'trip:left', tripId };
  }

  @SubscribeMessage('driver:location')
  handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: DriverLocationPayload,
  ) {
    const { tripId, driverId, latitude, longitude, speed, bearing } = payload;

    if (!tripId || latitude === undefined || longitude === undefined) {
      return;
    }

    const locationEvent: IDriverLocationEvent = {
      driverId,
      tripId,
      latitude,
      longitude,
      speed,
      bearing,
      timestamp: new Date().toISOString(),
    };

    // Cache latest location
    this.tripLocations.set(tripId, locationEvent);

    // Broadcast to all clients in the trip room
    const room = `trip_${tripId}`;
    this.server.to(room).emit('trip:location', locationEvent);

    return { event: 'driver:location:ack', success: true };
  }
}
