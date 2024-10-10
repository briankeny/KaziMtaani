import React from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const SignUpScreen = ({ navigation }:any) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data:any) => {
    try {
      const response = await axios.post('http://your-api-url.com/api/signup/', data);
      if (response.status === 201) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            placeholder="Enter email"
          />
        )}
        name="email"
        defaultValue=""
      />
      {errors.email && <Text>This is required.</Text>}

      <Text>Password:</Text>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            placeholder="Enter password"
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && <Text>This is required.</Text>}

      <Button title="Sign Up" onPress={()=>onSubmit(handleSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default SignUpScreen;