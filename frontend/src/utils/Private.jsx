import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles, userRole }) => {
  if (!userRole) {
    // Пользователь не аутентифицирован, перенаправляем на страницу входа
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // У пользователя нет разрешения на доступ к данной странице, перенаправляем на страницу с сообщением об ошибке или на домашнюю страницу
    return <Navigate to="/access-denied" />;
  }

  // Пользователь аутентифицирован и имеет правильную роль, отображаем компонент
  return <Route element={element} />;
};

export default PrivateRoute;