import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AuthContextProvider } from './contexts/AuthContext';
import { AdminRoom } from './pages/AdminRoom';


// exact: força que a URL seja identica, para evitar de mais de uma ser executada
// Switch: se uma rota pegou pára de procurar nas demais

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>  
          <Route path="/" exact={true} component={Home} />  
          <Route path="/rooms/new" component={NewRoom} />   
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
