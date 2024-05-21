import { StyleSheet } from 'react-native';

export const AuthStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,
    marginTop: '-30%',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '25%',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'rgba(255, 255, 255, 0.99)',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
  },
  orText: {
    fontSize: 16,
    color: '#828282',
    marginVertical: 12,
  },
  terms: {
    fontSize: 12,
    color: '#828282',
    textAlign: 'center',
    marginTop: 12,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#000000',
  },
});
