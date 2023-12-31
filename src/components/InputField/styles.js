import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    marginBottom: 20,
    width: 260,
  },
  field: {
    borderBottomWidth: 1,
    height: 38,
    padding: 10,
    color: '#BDBDBD',
    paddingLeft: 0,
    fontSize: 14,

    fontWeight: '300',
    lineHeight: 'normal',
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
  },
  inputText: {
    color: 'blue',
  },
  placeHolderText: {},
  title: {
    marginTop: 5,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 'normal',
    flexShrink: 0,
  },
  validateMessage: {
    marginTop: 3,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: 'normal',
    flexShrink: 0,
    color: '#EB5757',
  },
});

export default styles;
