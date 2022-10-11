import {FormPage} from '../components/form-page';
import {AuthorizationForm} from '../components/authorization-form';

const body = document.getElementsByTagName('body')[0];
const formPage = new FormPage(body);
formPage.headerText = 'Sign in to FileHub';
formPage.addForm((slot) => {
  new AuthorizationForm(slot);
});
