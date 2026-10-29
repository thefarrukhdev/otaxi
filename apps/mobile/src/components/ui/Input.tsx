import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS } from '../../lib/theme';
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
  wrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
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
      wrapperStyle,
      inputStyle,
      textStyle,
      onFocus,
      onBlur,
      editable = true,
      accessibilityLabel,
      accessibilityHint,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
      Haptics.selection();
      onChangeText?.('');
      onClear?.();
    };

    const hasValue = Boolean(value && value.length > 0);
    const isError = Boolean(error);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputFocused,
            isError && styles.inputError,
            !editable && styles.inputDisabled,
            wrapperStyle,
            inputStyle,
          ]}
        >
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[styles.textInput, !editable && styles.textInputDisabled, textStyle]}
            placeholderTextColor="#64748B"
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            accessibilityLabel={accessibilityLabel || label || rest.placeholder}
            accessibilityHint={accessibilityHint || hint}
            aria-invalid={isError}
            accessibilityState={{ disabled: !editable }}
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

          {clearable && hasValue && editable && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Matnni tozalash"
            >
              <XCircle size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>

        {error ? (
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        ) : hint ? (
          <Text style={styles.hintText}>{hint}</Text>
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
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#272B35',
    backgroundColor: '#0C0D11',
    paddingHorizontal: 12,
    height: 48,
  },
  inputFocused: {
    borderColor: '#FF8800',
    backgroundColor: '#0C0D11',
  },
  inputError: {
    borderColor: COLORS.red[500],
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#15171E',
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
    padding: 6,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textInputDisabled: {
    color: '#64748B',
  },
  errorText: {
    fontSize: 12,
    color: COLORS.red[500],
    marginTop: 4,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 16,
  },
});
