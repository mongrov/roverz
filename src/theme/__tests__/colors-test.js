import 'react-native';
// import brand from '../colors';
import Colors from '../colors';

it('colors function renders correctly', () => {
  expect(Colors.avatar(Colors.avatarColors)).toBe(Colors.avatarColors);
  expect(Colors.chat(Colors.chatColors)).toBe(Colors.chatColors);
  expect(Colors.status(Colors.statusColors)).toBe(Colors.statusColors);
  const obj1 = this.brandColors;
  expect(Colors.setBrandColors(this.brandColors)).toEqual(obj1);
  const obj2 = this.chatColors;
  expect(Colors.setChatColors(this.chatColors)).toEqual(obj2);
  const array = this.avatarColors;
  expect(Colors.setAvatarColors(this.avatarColors)).toEqual(array);
});
