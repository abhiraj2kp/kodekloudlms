import React from 'react';
import styles from './fallback.style';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

export type Props = {error: Error; resetError: () => void};

/**
 * Renders a fallback component to display an error message.
 *
 * @param {Props} props - The props object containing the error and resetError function.
 * @param {Error} props.error - The error object to be displayed.
 * @param {() => void} props.resetError - The function to reset the error.
 * @return {JSX.Element} The fallback component with the error message and a button to try again.
 */
const FallbackComponent = (props: Props) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.subtitle}>{"There's an error"}</Text>
      <Text style={styles.error}>{props.error.toString()}</Text>
      <TouchableOpacity style={styles.button} onPress={props.resetError}>
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export default FallbackComponent;
