import React, {useEffect, useState} from 'react';
import styles from './styles';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import InputField from '../../components/InputField/inputField';
import TouchableOpacityComponent from '../../components/TouchableOpacity/touchableOpacity';
import jwt_decode from 'jwt-decode';
import DatePicker from 'react-native-date-picker';
import {useKeyboard} from '../../services/heightKeyboard';
import CardComponent from '../../components/Card/cardComponent';
import {useDispatch, useSelector} from 'react-redux';
import {addMember} from '../../redux/HomeScreen/Members/memberSlice';
import {addLoggedUser} from '../../redux/HomeScreen/Auth/authSlice';
import {addNewDateTime} from '../../redux/HomeScreen/DateTime/dateTimeSlice';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
  Image,
  Dimensions,
} from 'react-native';

function HomeScreen() {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [sayHello, setSayHello] = useState('');
  const [showTime, setShowTime] = useState(new Date());
  const [showDateTimePicker, setDateTimePicker] = useState(false);
  const [idUser, setIdUser] = useState('');
  const [showAddMemnberModal, setShowAddMemberModal] = useState(false);
  const keyboardHeight = useKeyboard();
  const dispatch = useDispatch();
  const members = useSelector(state => state.members);
  const loggedUser = useSelector(state => state.loggedUser);
  const listDateTime = useSelector(state => state.listDateTime);
  console.log(`logger user: ${JSON.stringify(loggedUser)}`);
  console.log(`members: ${JSON.stringify(members)}`);
  console.log(`listDateTime: ${JSON.stringify(listDateTime)}`);
  const choosedTime = showTime.toString().substring(0, 10);
  useEffect(preState => {
    setShowSignInModal(!preState);
  }, []);

  const signIn = async () => {
    try {
      const response = await fetch(
        'https://mt-qc.vietcap.com.vn/api/iam-external-service/v1/authentication/login',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'grant-type': 'password',
            'client-id': '8202ca6a-6d69-44c9-ad17-cb5596b92015',
            'client-secret': 'FJ2jHe8exf8zyRm',
          },
          body: JSON.stringify({
            username: '068C121214',
            password: 'vcsc1234',
            // username: userName,
            // password: password,
          }),
        },
      );
      const json = await response.json();
      const decodeData = jwt_decode(json.data.token);

      setIdUser(decodeData.uuid);
      setSayHello(`Hello, ${decodeData.customerName}`);
      setShowSignInModal(!showSignInModal);
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {});

  useEffect(() => {
    const data = {
      id: idUser,
    };

    dispatch(addLoggedUser(data));
  }, [dispatch, idUser]);

  const formatMonth = month => {
    var monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month];
  };

  const formatDay = day => {
    var days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[day];
  };

  const marginOfModal = () =>
    keyboardHeight === 0
      ? Dimensions.get('window').height / 3.5
      : Dimensions.get('window').height / 1.7 - keyboardHeight;

  const addMemberToList = () => {
    let idNewMember = uuidv4();
    const data = {
      leaderId: idUser,
      memberId: idNewMember,
      fullName: fullName,
      title: title,
    };

    dispatch(addMember(data));

    const checkDate = listDateTime.find(item => item.time === choosedTime);
    if (typeof checkDate === 'undefined') {
      dispatch(
        addNewDateTime({
          time: choosedTime,
          members: [idNewMember],
        }),
      );
    } else {
      dispatch(
        addNewDateTime({
          checkTime: choosedTime,
          idMember: idNewMember,
        }),
      );
    }

    setShowAddMemberModal(false);
  };

  return (
    <SafeAreaView>
      <StatusBar />

      <View style={styles.parrentColumn}>
        {/* row  include: date, month, year and timePickerButton*/}
        <View style={styles.rowDateTime}>
          <Text
            style={styles.timeDateMonth}>{`${showTime.getDate()} ${formatMonth(
            showTime.getMonth(),
          )}`}</Text>
          <Text style={styles.timeYear}>{showTime.getFullYear()}</Text>
          <TouchableOpacity onPress={() => setDateTimePicker(true)}>
            <Image
              source={require('/Users/administrator/Documents/react_native/TimeTrackingApp/src/assets/images/dropDown.png')}
            />
          </TouchableOpacity>
        </View>

        {/* weekday*/}
        <Text style={styles.weeksDay}>{formatDay(showTime.getDay())}</Text>

        {/* say Hello useName */}
        <Text style={styles.sayHello}>{sayHello}</Text>

        {/* List of member card */}
        {sayHello === '' ? null : (
          <FlatList
            style={styles.listCard}
            data={members}
            renderItem={({item}) => (
              <CardComponent fullName={item.fullName} title={item.title} />
            )}
            keyExtractor={item => item.id}
          />
        )}

        {/* Date time picker */}
        <DatePicker
          modal
          open={showDateTimePicker}
          date={showTime}
          mode="date"
          onConfirm={date => {
            setShowTime(date);
            setDateTimePicker(false);
          }}
          onCancel={() => {
            setDateTimePicker(false);
          }}
        />

        {/* add new member Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddMemnberModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setShowSignInModal(!showAddMemnberModal);
          }}>
          <TouchableOpacity
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width,
            }}
            onPress={() => {
              setShowAddMemberModal(false);
            }}>
            <View
              style={[
                styles.modalPosition,
                {
                  marginTop: marginOfModal(),
                },
              ]}>
              <View style={styles.modalView}>
                {/* Sign in to your account */}
                <View style={styles.titleModal}>
                  <Text style={styles.signIn}>Add a member</Text>
                  <Text style={styles.toYourAccount}>to your team</Text>
                </View>
                {/* Text input for userName password */}
                <View style={styles.columnInput}>
                  {/* useName */}
                  <InputField
                    placeholder={'Enter your member name'}
                    keyboardType={'default'}
                    selectionColor={'#2D9CDB'}
                    title={'Full name'}
                    onChangeText={newText => setFullName(newText)}
                    value={fullName}
                  />
                  {/* password */}
                  <InputField
                    placeholder={'Enter your member title'}
                    keyboardType={'default'}
                    selectionColor={'#2D9CDB'}
                    title={'Title'}
                    onChangeText={newText => setTitle(newText)}
                    value={title}
                  />
                </View>
                {/* Sign in button */}
                <View style={styles.buttonModal}>
                  <TouchableOpacityComponent
                    content={'Save'}
                    onPress={() => {
                      addMemberToList();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* floating button */}
        {sayHello === '' ? null : (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setShowAddMemberModal(true)}>
            <Image
              source={require('/Users/administrator/Documents/react_native/TimeTrackingApp/src/assets/images/plus.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Sign in Modal */}
      <View style={{backgroundColor: '#BDBDBD', height: '100%'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSignInModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setShowSignInModal(!showSignInModal);
          }}>
          <View
            style={[
              styles.modalPosition,
              {
                marginTop: marginOfModal(),
              },
            ]}>
            <View style={styles.modalView}>
              {/* Sign in to your account */}
              <View style={styles.titleModal}>
                <Text style={styles.signIn}>Sign in</Text>
                <Text style={styles.toYourAccount}>to your account</Text>
              </View>
              {/* Text input for userName password */}
              <View style={styles.columnInput}>
                {/* useName */}
                <InputField
                  placeholder={'068C121214'}
                  keyboardType={'default'}
                  selectionColor={'#2D9CDB'}
                  title={'Username'}
                  onChangeText={newText => setUserName(newText)}
                  value={userName}
                />
                {/* password */}
                <InputField
                  placeholder={'vcsc1234'}
                  keyboardType={'default'}
                  selectionColor={'#2D9CDB'}
                  title={'Password'}
                  onChangeText={newText => setPassword(newText)}
                  value={password}
                />
              </View>
              {/* Sign in button */}
              <View style={styles.buttonModal}>
                <TouchableOpacityComponent
                  content={'Sign in'}
                  onPress={() => {
                    signIn();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
