import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import Section from '../Section';
import Container from '../Container';
import ContactForm from '../ContactForm';
import Filter from '../Filter';
import ContactList from '../ContactList';

import s from './App.module.css';

const App = () => {
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [filter, setFilter] = useState('');

  const repeatCheck = newName => {
    return contacts.find(({ name }) => name === newName);
  };

  const showNotification = () => {
    store.addNotification({
      title: 'Oops!',
      message:
        'But there’s already a contact with that name on your contact list',
      type: 'danger',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  };

  const addContact = ({ name, number }) => {
    if (!repeatCheck(name)) {
      const contact = {
        id: uuidv4(),
        name,
        number,
      };

      setContacts(prevContacts => [contact, ...prevContacts]);
      return;
    }

    showNotification();
  };

  const deleteContact = contactId => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  const handlerFilterValue = e => {
    setFilter(e.currentTarget.value.trim());
  };

  const getResultSearch = () => {
    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.number.includes(filter),
    );
  };

  return (
    <>
      <ReactNotification />
      <header className={s.header}>
        <Container>
          <h1 className={s.title}>My phonebook</h1>
        </Container>
      </header>
      <Section nameForClass={'section'}>
        <div className={s.newContactWrapper}>
          <h2 className={s.newContactTitle}>A new contact</h2>
          <ContactForm onSubmit={addContact} />
        </div>
      </Section>
      <Section nameForClass={'sectionList'}>
        <h2 className={s.titleContacts}>Contacts</h2>
        <Filter name={filter} onChange={handlerFilterValue} />
        {contacts[0] && getResultSearch()[0] ? (
          <ContactList
            contacts={getResultSearch()}
            onDeleteContact={deleteContact}
          />
        ) : (
          <p className={s.text}>There’s nothing here yet...</p>
        )}
      </Section>
    </>
  );
};

export default App;
