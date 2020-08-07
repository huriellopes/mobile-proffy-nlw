import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Picker } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { ITeacher } from '../../components/TeacherItem';

import styles from './styles';

const TeacherList: React.FC = () => {
  const [subjectList, setSubjectList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [subject, setSubject] = useState('');
  const [weekday, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: ITeacher) => {
            return teacher.id;
          },
        );

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  async function handleFiltersSubmit() {
    loadFavorites();
    const { data } = await api.get('/classes', {
      params: {
        subject,
        week_day: weekday,
        time,
      },
    });
    setIsFiltersVisible(false);
    setTeachers(data);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        // eslint-disable-next-line prettier/prettier
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
          // eslint-disable-next-line prettier/prettier
        )}
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <Picker
              selectedValue={subject}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) => setSubject(itemValue)}
            >
              <Picker.Item
                label="Selecione uma matéria"
                value="Selecione uma matéria"
              />
              <Picker.Item label="Artes" value="Artes" />
              <Picker.Item label="Educação Física" value="Educação Física" />
              <Picker.Item label="Matemática" value="Matemática" />
              <Picker.Item label="Geografia" value="Geografia" />
              <Picker.Item label="História" value="História" />
              <Picker.Item label="Ciências" value="Ciências" />
              <Picker.Item label="Química" value="Química" />
              <Picker.Item label="Física" value="Física" />
              <Picker.Item label="Filosófia" value="Filosófia" />
              <Picker.Item label="Sociologia" value="Sociologia" />
            </Picker>
            {/* <TextInput
              value={subject}
              onChangeText={text => setSubject(text)}
              style={styles.input}
              placeholder="Qual a matéria?"
              placeholderTextColor="#c1bccc"
            /> */}

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <Picker
                  selectedValue={weekday}
                  style={styles.input}
                  onValueChange={
                    (itemValue, itemIndex) => setWeekDay(itemValue)
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  <Picker.Item
                    label="Selecione um dia"
                    value="Selecione um dia"
                  />
                  <Picker.Item label="Domingo" value="0" />
                  <Picker.Item label="Segunda-Feira" value="1" />
                  <Picker.Item label="Terça-Feira" value="2" />
                  <Picker.Item label="Quarta-Feira" value="3" />
                  <Picker.Item label="Quinta-Feira" value="4" />
                  <Picker.Item label="Sexta-Feira" value="5" />
                  <Picker.Item label="Sabádo" value="6" />
                </Picker>
                {/* <TextInput
                  value={weekday}
                  onChangeText={text => setWeekDay(text)}
                  style={styles.input}
                  placeholder="Qaul o Dia"
                  placeholderTextColor="#c1bccc"
                /> */}
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  value={time}
                  onChangeText={text => setTime(text)}
                  style={styles.input}
                  placeholder="Qual horário"
                  placeholderTextColor="#c1bccc"
                />
              </View>
            </View>

            <RectButton
              onPress={handleFiltersSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {teachers.map((teacher: ITeacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TeacherList;
