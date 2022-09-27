import React, { useState, useEffect, memo } from 'react';
import NoTagged from './NoTagged';
import FullTagList from './FullTagList';
import TagList from './TagList';

const CreateTagListContainer = (props) => {

  const [newUsersState, setNewUsersState] = useState([]);
  const [isFullUsers, setIsFullUsers] = useState(false);

  useEffect(() => {
    const users = props.data;
    let newUsers;
    switch (users.length) {
      case 1:
        newUsers = [...users];
        break;
      case 2:
        newUsers = [...users];
        newUsers[1].fullName = ' and ' + newUsers[1].fullName;
        break;
      case 3:
        newUsers = [...users];
        newUsers[2].fullName = ' and ' + users[2].fullName;
        break;
      default:
        newUsers = users.slice(0, 2);
        const newName = ' and ' + (users.length - 3) + ' others';
        newUsers.push({ id: -111, fullName: newName });
    }
    setNewUsersState(newUsers);

    return () => {
      setIsFullUsers(false);
    }
  }, [])

  const users = props.data;
  const callback = props.callback;
  const max = newUsersState.length - 1;

  if (users.length == 0) return <NoTagged />;
  if (isFullUsers == true) return <FullTagList data={props.data} callback={callback} />;
  return <TagList newUsersState={newUsersState} setIsFullUsers={setIsFullUsers} callback={callback} max={max} />
}

export default memo(CreateTagListContainer);
