import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import { Item, Input, Label } from 'native-base';
import styled from 'styled-components';
import fetchPatients from '../screens/PatientsScreen'

import { patientsApi } from '../utils/api';

import { Button, Container } from '../components';

const AddPatientScreen = ({ navigation }) => {
  const [values, setValues] = useState({});

  const handleChange = (name, e) => {
    const text = e.nativeEvent.text;
    setValues({
      ...values,
      [name]: text,
    });
  };

  const onSubmit = useCallback(() => {
    patientsApi
        .add(values)
        .then(() => {
            setValues({});
            navigation.push('Patients')
        })
        .catch(e => {
          alert('BAD');
        });
  }, [navigation, values]);

  return (
      <Container>
        <Item style={{ marginLeft: 0 }} floatingLabel>
          <Label>Имя и Фамилия</Label>
          <Input
              onChange={handleChange.bind(this, 'fullname')}
              value={values.fullname}
              style={{ marginTop: 12 }}
              autoFocus
          />
        </Item>
        <Item style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
          <Label>Номер телефона</Label>
          <Input
              onChange={handleChange.bind(this, 'phone')}
              value={values.phone}
              keyboardType="numeric"
              dataDetectorTypes="phoneNumber"
              style={{ marginTop: 12 }}
          />
        </Item>
        <ButtonView>
          <Button onPress={onSubmit} color="#87CC6F">
            <Text>Добавить пациента</Text>
          </Button>
        </ButtonView>
      </Container>
  );
};

const ButtonView = styled.View`
  flex: 1;
  margin-top: 30px;
`;

AddPatientScreen.navigationOptions = {
  title: 'Добавить пациента',
  headerTintColor: '#2A86FF',
  headerStyle: {
    elevation: 0.8,
    shadowOpacity: 0.8,
  },
};

export default AddPatientScreen;