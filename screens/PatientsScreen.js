import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, Alert, View, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Swipeable from 'react-native-swipeable-row';
import { Item, Input } from 'native-base';
import { Appointment, SectionTitle, PlusButton } from '../components';
import { patientsApi, phoneFormat } from '../utils';


const PatientsScreen =  props => {
    const { navigation } = props;
    const [data, setData] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  const fetchPatients = useCallback(() => {
    setIsLoading(true);
    patientsApi
        .get()
        .then(({ data }) => {
          setData(data.data);
        })
        .finally(e => {
          setIsLoading(false);
        });
  }, [setData]);


  useEffect(fetchPatients, []);

  const onSearch = e => {
    setSearchValue(e.nativeEvent.text);
  };

  const removePatient = id => {
    Alert.alert(
        'Удаление приема',
        'Вы действительно хотите удалить прием?',
        [
          {
            text: 'Отмена'
          },
          {
            text: 'Удалить',
            onPress: () => {
              setIsLoading(true);
              patientsApi
                  .remove(id)
                  .then(() => {
                    fetchPatients();
                  })
                  .catch(() => {
                    setIsLoading(false);
                  });
            }
          }
        ],
        { cancelable: false }
    );
  };

  return (
      <Container>
        {data && (
            <>
              <View style={{ padding: 20 }}>
                <Item style={{ paddingLeft: 15, borderRadius: 30 }} regular>
                  <Input  onChange={onSearch} placeholder="Поиск..."  />
                </Item>
              </View>
              <FlatList
                  data={data.filter(
                      item =>
                          item.fullname
                              .toLowerCase()
                              .indexOf(searchValue.toLowerCase()) >= 0
                  )}
                  keyExtractor={item => item._id}
                  onRefresh={fetchPatients}
                  refreshing={isLoading}
                  renderItem={({ item }) => (
                      <Swipeable
                          rightButtons={[
                            <SwipeViewButton onPress={navigation.navigate.bind(this, 'EditPatient', {
                                patientId: item._id
                            })} style={{ backgroundColor: '#B4C1CB' }}>
                              <Ionicons name="md-create" size={28} color="white" />
                            </SwipeViewButton>,
                            <SwipeViewButton
                                onPress={removePatient.bind(this, item._id)}
                                style={{ backgroundColor: '#F85A5A' }}
                            >
                              <Ionicons name="ios-close" size={48} color="white" />
                            </SwipeViewButton>
                          ]}
                      >
                        <Appointment
                            navigate={navigation.navigate}
                            item={{
                              patient: item,
                              diagnosis: phoneFormat(item.phone)
                            }}
                        />
                      </Swipeable>
                  )}
                  renderSectionHeader={({ section: { title } }) => (
                      <SectionTitle>{title}</SectionTitle>
                  )}
              />
            </>
        )}
        <PlusButton onPress={navigation.navigate.bind(this, 'AddPatient')} />
      </Container>
  );
};

PatientsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Пациенты',
  headerTintColor: '#2A86FF',
  headerStyle: {
    elevation: 0.8,
    shadowOpacity: 0.8
  },
    headerRight: () => (
    <TouchableOpacity
        onPress={navigation.navigate.bind(this, 'Home')}
        style={{ marginRight: 20 }}
    >
        <Ionicons name="md-home" size={28} color="black" />
    </TouchableOpacity>
    )
});

const SwipeViewButton = styled.TouchableOpacity`
  width: 75px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
`;

export default PatientsScreen;
