import React, { useState, useEffect, useCallback } from 'react';
import {Text, View} from 'react-native';
import {Item, Input, Label, Picker} from 'native-base';
import styled from 'styled-components';

import { appointmentsApi } from '../utils/api';

import { Button, Container } from '../components';
import DatePicker from "react-native-datepicker";

const EditAppointmentScreen = ({ navigation }) => {
    const [values, setValues] = useState({
        diagnosis: '',
        dentNumber: '',
        price: '',
        date: null,
        time: null,
        patient: '',
    });

    const appointmentId = navigation.getParam('appointmentId');

    const fetchAppointmentInfo = useCallback(async () => {
        const { data } = await appointmentsApi.getById({id: appointmentId});
        setValues(data.data);
        return data;
    }, [appointmentId]);

    useEffect(() => {
        fetchAppointmentInfo();
    }, []);

    useEffect(() => {
        fetchAppointmentInfo();
    }, [navigation.state])

    const setFieldValue = (name, value) => {
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleInputChange = (name, e) => {
        const text = e.nativeEvent.text;
        setFieldValue(name, text);
    };

    const onSubmit = useCallback(() => {
        appointmentsApi
            .update({id: appointmentId, values})
            .then(() => {
                navigation.push('Home');
            })
            .catch(e => {
                if (e.response.data && e.response.data.message) {
                    e.response.data.message.forEach(err => {
                        const fieldName = err.param;
                        alert(`Ошибка! Поле "${fieldsName[fieldName]}" указано неверно.`);
            });
    }
});
}, [appointmentId, values]);

    return (
        <Container>
            <Item style={{ marginLeft: 0 }} floatingLabel>
                <Label>Номер зуба</Label>
                <Input
                    onChange={handleInputChange.bind(this, 'dentNumber')}
                    value={values.dentNumber.toString()}
                    style={{ marginTop: 12 }}
                    keyboardType="numeric"
                    autoFocus
                />
            </Item>
            <Item style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
                <Label>Цена</Label>
                <Input
                    onChange={handleInputChange.bind(this, 'price')}
                    value={values.price.toString()}
                    keyboardType="numeric"
                    style={{ marginTop: 12 }}
                />
            </Item>
            <Item style={{ marginTop: 20, marginLeft: 0 }} >
                <Picker
                    mode="dropdown"
                    placeholder="Выберите диагноз"
                    placeholderStyle={{ color: '#bfc6ea' }}
                    placeholderIconColor="#007aff"
                    style={{ width: '100%' }}
                    onValueChange={setFieldValue.bind(this, 'diagnosis')}
                    selectedValue={values.diagnosis}
                >
                    <Picker.Item label="Выберите диагноз:" />
                    <Picker.Item label="пульпит" value="пульпит" />
                    <Picker.Item label="удаление зуба" value="удаление зуба" />
                    <Picker.Item label="спид" value="спид" />
                </Picker>
            </Item>
            <Item style={{ marginTop: 20, marginLeft: 0 }}>
                <TimeRow>
                    <View style={{ flex: 1 }}>
                        <DatePicker
                            date={new Date()}
                            mode="date"
                            placeholder="Дата"
                            format="YYYY-MM-DD"
                            minDate={new Date()}
                            confirmBtnText="Сохранить"
                            cancelBtnText="Отмена"
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0
                                },
                                dateText: {
                                    fontSize: 18
                                }
                            }}
                            date={values.date}
                            onDateChange={setFieldValue.bind(this, 'date')}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <DatePicker
                            mode="time"
                            placeholder="Время"
                            format="HH:mm"
                            minDate={new Date()}
                            confirmBtnText="Сохранить"
                            cancelBtnText="Отмена"
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0
                                },
                                dateText: {
                                    fontSize: 18
                                }
                            }}
                            date={values.time}
                            onDateChange={setFieldValue.bind(this, 'time')}
                        />
                    </View>
                </TimeRow>
            </Item>
            <ButtonView>
                <Button onPress={onSubmit} color="#87CC6F">
                    <Text>Сохранить</Text>
                </Button>
            </ButtonView>
        </Container>
    );
};

const ButtonView = styled.View`
  flex: 1;
  margin-top: 30px;
`;

EditAppointmentScreen.navigationOptions = {
    title: 'Редактирование',
    headerTintColor: '#2A86FF',
    headerStyle: {
        elevation: 0.8,
        shadowOpacity: 0.8,
    },
};

const TimeRow = styled.View`
  flex-direction: row;
`;

export default EditAppointmentScreen;
