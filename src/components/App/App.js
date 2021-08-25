import { Component } from 'react';
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

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const newContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (newContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(newContacts));
    }
  }

  repeatCheck = newName => {
    return this.state.contacts.find(({ name }) => name === newName);
  };

  showNotification = () => {
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

  addContact = ({ name, number }) => {
    if (!this.repeatCheck(name)) {
      const contact = {
        id: uuidv4(),
        name,
        number,
      };

      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
      return;
    }
    this.showNotification();
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  setFilterValue = e => {
    this.setState({ filter: e.currentTarget.value.trim() });
  };

  getResultSearch = () => {
    const { filter, contacts } = this.state;

    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.number.includes(filter),
    );
  };

  render() {
    const { filter } = this.state;
    const ResultSearch = this.getResultSearch();
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
            <ContactForm onSubmit={this.addContact} />
          </div>
        </Section>
        <Section nameForClass={'sectionList'}>
          <h2 className={s.titleContacts}>Contacts</h2>
          <Filter name={filter} onChange={this.setFilterValue} />
          {this.state.contacts[0] && ResultSearch[0] ? (
            <ContactList
              contacts={ResultSearch}
              onDeleteContact={this.deleteContact}
            />
          ) : (
            <p className={s.text}>There’s nothing here yet...</p>
          )}
        </Section>
      </>
    );
  }
}

export default App;
