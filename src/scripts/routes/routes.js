import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/authentication/login/login-page';
import RegisterPage from '../pages/authentication/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/login': checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': checkAuthenticatedRoute(new HomePage()),
  '/add-story': checkAuthenticatedRoute(new AddStoryPage()),
  '/detail-story/:id': checkAuthenticatedRoute(new DetailStoryPage()),
};

export default routes;
