import PropTypes from 'prop-types';
import { GoSearch } from 'react-icons/go';

import s from './Filter.module.css';

const Filter = ({ name, onChange }) => (
  <>
    <label className={s.label}>
      <input
        className={s.input}
        placeholder="Enter to search..."
        type="text"
        name={name}
        onChange={onChange}
        pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
        title="Имя может состоять только из букв, апострофа, тире и пробелов. Например Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan и т. п."
        required
      />
      <GoSearch className={s.icon} />
    </label>
  </>
);

export default Filter;

Filter.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};
