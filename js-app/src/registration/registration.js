import {FormPage} from '../components/form-page';
import {RegistrationForm} from '../components/registration-form';

const body = document.getElementsByTagName('body')[0];
const formPage = new FormPage(body);
formPage.headerText = 'Sign up to FileHub';
formPage.addForm((slot) => {
  new RegistrationForm(slot);
});
