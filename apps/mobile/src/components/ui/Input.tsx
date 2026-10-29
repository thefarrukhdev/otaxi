import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../lib/theme';
import { useTheme } from '../../hooks/useTheme';
import { XCircle } from 'lucide-react-native';
import { Haptics } from './Haptics';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = React.memo(
  ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    value,
    onChangeText,
    containerStyle,
    inputStyle,
    onFocus,
    onBlur,
    ...rest
  }) => {
    const { isDriver } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
      Haptics.selection();
      onChangeText?.('');
      onClear?.();
    };

    const hasValue = Boolean(value && value.length > 0);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, isDriver && styles.labelDriver]}>{label}</Text>
        )}

        <View
          style={[
            styles.inputWrapper,
            isDriver ? styles.inputWrapperDriver : styles.inputWrapperPassenger,
            isFocused && (isDriver ? styles.inputFocusedDriver : styles.inputFocusedPassenger),
            Boolean(error) && styles.inputError,
            inputStyle,
          ]}
        >
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

          <TextInput
            style={[
              styles.textInput,
              isDriver ? styles.textInputDriver : styles.textInputPassenger,
            ]}
            placeholderTextColor="#64748B"
            value={value}
            onChangeText={onChangeText}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />

          {clearable && hasValue && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn} activeOpacity={0.7}>
              <XCircle size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : hint ? (
          <Text style={[styles.hintText, styles.hintTextDriver]}>{hint}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  labelDriver: {
    color: '#CBD5E1',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperPassenger: {
    backgroundColor: '#0C0D11',
    borderColor: '#272B35',
  },
  inputWrapperDriver: {
    backgroundColor: '#0C0D11',
    borderColor: '#272B35',
  },
  inputFocusedPassenger: {
    borderColor: '#FF8800',
    backgroundColor: '#0C0D11',
  },
  inputFocusedDriver: {
    borderColor: '#FF8800',
    backgroundColor: '#0C0D11',
  },
  inputError: {
    borderColor: COLORS.red[500],
  },
  leftIconWrapper: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconWrapper: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    padding: 4,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  textInputPassenger: {
    color: '#FFFFFF',
  },
  textInputDriver: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red[500],
    marginTop: 4,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  hintTextDriver: {
    color: '#94A3B8',
  },
});
