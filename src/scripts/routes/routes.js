import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/authentication/login/login-page';
import RegisterPage from '../pages/authentication/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';

const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/detail-story/:id': new DetailStoryPage(),
};

export default routes;
