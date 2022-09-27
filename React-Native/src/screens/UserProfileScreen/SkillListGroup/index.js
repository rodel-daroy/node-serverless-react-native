import React, {useState, useContext, useMemo} from 'react';

import PopupContext from '../../../context/Popup/PopupContext';
import DefaultErrorContext from '../../../context/DefaultError/DefaultErrorContext';
import SkillItem from './SkillItem';
import {voteToPost, addSkill, deleteSkill} from '../../../actions/userActions';
import SkillListGroup from './SkillListGroup';

const SkillListGroupContainer = (props) => {
    const {setPopup} = useContext(PopupContext);
    const alert = setPopup;
    const {defaultError} = useContext(DefaultErrorContext);

    const [skillValue, setSkillValue] = useState('');

    const likeAction = (item) => {
        voteToPost(
            props.user.accessToken,
            {id: item.id, value: 'LIKE', type: 'SKILL'},
            props.callback,
            (err) => {
                defaultError(err)
            }
        );
    }

    const disLikeAction = (item) => {
        voteToPost(
            props.user.accessToken,
            {id: item.id, value: 'DISLIKE', type: 'SKILL'},
            props.callback,
            (err) => {
                defaultError(err)
            }
        );
    }

    const addSkillAction = () => {
        addSkill(
            props.user.accessToken,
            props.profileData.id,
            skillValue,
            props.callback,
            (err) => {
                defaultError(err);
            }
        );
        setSkillValue('');
    }

    const deleteSkillAction = (skillId) => {
        deleteSkill(
            props.user.accessToken,
            props.user.userId,
            skillId,
            props.callback,
            (err) => {
                defaultError(err);
            }
        );
    }

    const renderItems = useMemo(() => {
        const df = [
            {
                id: 1,
                name: 'HTML',
                totalLikes: 100,
                totalDislikes: 807,
                likeActive: true,
                dislikeActive: false,
                votedList: [],
            },
        ];

        const options = props.user.userId === props.userId ?
            ["Delete", "cancel"]
            :
            ["Report", "cancel"]

        let data = props.data || df;

        data.sort((a, b) => {
            return b?.voteData?.total - a?.voteData?.total;
        });

        return data.map((item, index) => (
            <SkillItem
                alert={alert}
                onReportAction={props.onReportAction}
                deleteSkillAction={deleteSkillAction}
                data={item}
                userId={props.userId}
                user={props.user}
                options={options}
                key={index}
                onLikeAction={() => likeAction(item)}
                onDisLikeAction={() => disLikeAction(item)}
            />
        ));
    }, [props.userId, props.user, props.data, props.onReportAction, likeAction, disLikeAction, deleteSkillAction, SkillItem]);

    const _handleReport = () => {
        reportToPerson(
            props.user.accessToken,
            {id: userData.id, type: 'USER', type: 'report'},
            res => {
                alert('Reported successfully');
            },
            err => {
                alert(err.response?.data?.message ?? 'Error')
            },
        );
    }

    return (
        <SkillListGroup
            {...props}
            skillValue={skillValue}
            setSkillValue={setSkillValue}
            addSkillAction={addSkillAction}
            renderItems={renderItems}
        />
    );

}

export default SkillListGroupContainer;