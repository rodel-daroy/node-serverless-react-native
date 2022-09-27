import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";

import PopupContext from '../../context/Popup/PopupContext';
import DefaultErrorContext from "../../context/DefaultError/DefaultErrorContext";
import CONSTANTS from "../../common/PeertalConstants";
import { voteCharacter } from "../../actions/userActions";
import CharacterGroup from "./CharacterGroup";

const CharacterGroupContainer = (props) => {
  const { defaultError } = useContext(DefaultErrorContext);
  const { setPopup } = useContext(PopupContext);
  const alert = setPopup;

  const characterData = props.data;

  const [extrovert, setExtrovert] = useState({});
  const [introvert, setIntrovert] = useState({});
  const [intuitive, setIntuitive] = useState({});
  const [observant, setObservant] = useState({});
  const [feeling, setFeeling] = useState({});
  const [thinking, setThinking] = useState({});
  const [prospecting, setProspecting] = useState({});
  const [judging, setJudging] = useState({});

  useEffect(() => {
    setExtrovert({ number: characterData ? characterData.extrovert.total : 0, active: characterData ? characterData.extrovert.active : false });
    setIntrovert({ number: characterData ? characterData.introvert.total : 0, active: characterData ? characterData.introvert.active : false });
    setIntuitive({ number: characterData ? characterData.intuitive.total : 0, active: characterData ? characterData.intuitive.active : false });
    setObservant({ number: characterData ? characterData.observant.total : 0, active: characterData ? characterData.observant.active : false });
    setFeeling({ number: characterData ? characterData.feeling.total : 0, active: characterData ? characterData.feeling.active : false });
    setThinking({ number: characterData ? characterData.thinking.total : 0, active: characterData ? characterData.thinking.active : false });
    setProspecting({ number: characterData ? characterData.prospecting.total : 0, active: characterData ? characterData.prospecting.active : false });
    setJudging({ number: characterData ? characterData.judging.total : 0, active: characterData ? characterData.judging.active : false });
  }, [props.data])

  const handleVote = (character) => {
    if (character === 'extrovert') {
      if (extrovert.active) {
        setExtrovert({ number: extrovert.number - 1, active: false });
      }
      if (!extrovert.active) {
        setExtrovert({ number: extrovert.number + 1, active: true });
        if (introvert.active) {
          setIntrovert({ number: introvert.number - 1, active: false })
        }
      }
    }
    if (character === 'introvert') {
      if (introvert.active) {
        setIntrovert({ number: introvert.number - 1, active: false });
      }
      if (!introvert.active) {
        setIntrovert({ number: introvert.number + 1, active: true });
        if (extrovert.active) {
          setExtrovert({ number: extrovert.number - 1, active: false })
        }
      }
    }
    if (character === 'intuitive') {
      if (intuitive.active) {
        setIntuitive({ number: intuitive.number - 1, active: false });
      }
      if (!intuitive.active) {
        setIntuitive({ number: intuitive.number + 1, active: true });
        if (observant.active) {
          setObservant({ number: observant.number - 1, active: false })
        }
      }
    }
    if (character === 'observant') {
      if (observant.active) {
        setObservant({ number: observant.number - 1, active: false });
      }
      if (!observant.active) {
        setObservant({ number: observant.number + 1, active: true });
        if (intuitive.active) {
          setIntuitive({ number: intuitive.number - 1, active: false });
        }
      }
    }
    if (character === 'feeling') {
      if (feeling.active) {
        setFeeling({ number: feeling.number - 1, active: false });
      }
      if (!feeling.active) {
        setFeeling({ number: feeling.number + 1, active: true });
        if (thinking.active) {
          setThinking({ number: thinking.number - 1, active: false });
        }
      }
    }
    if (character === 'thinking') {
      if (thinking.active) {
        setThinking({ number: thinking.number - 1, active: false });
      }
      if (!thinking.active) {
        setThinking({ number: thinking.number + 1, active: true });
        if (feeling.active) {
          setFeeling({ number: feeling.number - 1, active: false });
        }
      }
    }
    if (character === 'prospecting') {
      if (prospecting.active) {
        setProspecting({ number: prospecting.number - 1, active: false });
      }
      if (!prospecting.active) {
        setProspecting({ number: prospecting.number + 1, active: true });
        if (judging.active) {
          setJudging({ number: judging.number - 1, active: false });
        }
      }
    }
    if (character === 'judging') {
      if (judging.active) {
        setJudging({ number: judging.number - 1, active: false });
      }
      if (!judging.active) {
        setJudging({ number: judging.number + 1, active: true });
        if (prospecting.active) {
          setProspecting({ number: prospecting.number - 1, active: false });
        }
      }
    }
    voteCharacter(props.user.accessToken, props.userId, character, res => {
      //props.onReload();
    }, (err) => defaultError(err));
  }

  let item1 = {
    left: { name: "introvert", number: introvert.number, active: introvert.active },
    right: { name: "extrovert", number: extrovert.number, active: extrovert.active }
  };
  let item2 = {
    left: { name: "observant", number: observant.number, active: observant.active },
    right: { name: "intuitive", number: intuitive.number, active: intuitive.active }
  };
  let item3 = {
    left: { name: "thinking", number: thinking.number, active: thinking.active },
    right: { name: "feeling", number: feeling.number, active: feeling.active }
  };
  let item4 = {
    left: { name: "judging", number: judging.number, active: judging.active },
    right: { name: "prospecting", number: prospecting.number, active: prospecting.active }
  };

  const getCharacterCode = (i, e, s, n, t, f, j, p) => {
    const firstElement = e - i >= 0 ? "e" : "i";
    const secondElement = n - s >= 0 ? "n" : "s";
    const thirdElement = f - t >= 0 ? "f" : "t";
    const fourthElement = p - j >= 0 ? "p" : "j";
    return firstElement + secondElement + thirdElement + fourthElement;
  }
  const code = getCharacterCode(introvert.number, extrovert.number, observant.number, intuitive.number, thinking.number, feeling.number, judging.number, prospecting.number);
  const character = personalityData.find(personality => personality.code === code);
  const cName = character.name || "...";
  const cImageUrl = characterData
    ? character.image_src : CONSTANTS.RANDOM_IMAGE
  const cDescription = character.summary || "...";

  return (
    <CharacterGroup
      {...props}
      handleVote={handleVote}
      item1={item1}
      item2={item2}
      item3={item3}
      item4={item4}
      cName={cName}
      cImageUrl={cImageUrl}
      cDescription={cDescription}
      alert={alert}
    />
  );
}

const mapStateToProps = store => ({ user: store.user });
const CharacterGroupContainerWrapper = connect(mapStateToProps)(CharacterGroupContainer);
export default CharacterGroupContainerWrapper;

const personalityData = [
  {
    code: '',
    name: 'None',
    summary: 'Unselected...',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../../assets/character/man-Logistician.png'),
  },
  {
    code: 'istj',
    name: 'Logistician',
    summary:
      'Practical and fact-minded individuals, whose reliability cannot be doubted.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istj.png',
    app_image_src: require('../../assets/character/man-Logistician.png'),
  },
  {
    code: 'istp',
    name: 'Virtuoso',
    summary: 'Bold and practical experimenters, masters of all kinds of tools.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/istp.png',
    app_image_src: require('../../assets/character/man-Virtuoso.png'),
  },
  {
    code: 'isfj',
    name: 'Defender',
    summary:
      'Very dedicated and warm protectors, always ready to defend their loved ones.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfj.png',
    app_image_src: require('../../assets/character/man-Defender.png'),
  },
  {
    code: 'isfp',
    name: 'Adventurer',
    summary:
      'Flexible and charming artists, always ready to explore and experience something new.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/isfp.png',
    app_image_src: require('../../assets/character/man-Adventurer.png'),
  },
  {
    code: 'intj',
    name: 'Architect',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intj.png',
    app_image_src: require('../../assets/character/man-Architect.png'),
  },
  {
    code: 'intp',
    name: 'Logician',
    summary: 'Innovative inventors with an unquenchable thirst for knowledge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/intp.png',
    app_image_src: require('../../assets/character/man-Logician.png'),
  },
  {
    code: 'infj',
    name: 'Advocate',
    summary: 'Quiet and mystical, yet very inspiring and tireless idealists.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infj.png',
    app_image_src: require('../../assets/character/man-Advocate.png'),
  },
  {
    code: 'infp',
    name: 'Mediator',
    summary:
      'Poetic, kind and altruistic people, always eager to help a good cause.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/infp.png',
    app_image_src: require('../../assets/character/man-Mediator.png'),
  },
  {
    code: 'estj',
    name: 'Executive',
    summary:
      'Excellent administrators, unsurpassed at managing things – or people.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estj.png',
    app_image_src: require('../../assets/character/man-Executive.png'),
  },
  {
    code: 'estp',
    name: 'Entrepreneur',
    summary:
      'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/estp.png',
    app_image_src: require('../../assets/character/man-Entrepreneur.png'),
  },
  {
    code: 'esfj',
    name: 'Consul',
    summary:
      'Extraordinarily caring, social and popular people, always eager to help.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfj.png',
    app_image_src: require('../../assets/character/man-Consul.png'),
  },
  {
    code: 'esfp',
    name: 'Entertainer',
    summary:
      'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/esfp.png',
    app_image_src: require('../../assets/character/man-Entertainer.png'),
  },
  {
    code: 'entj',
    name: 'Commander',
    summary:
      'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entj.png',
    app_image_src: require('../../assets/character/man-Commander.png'),
  },
  {
    code: 'entp',
    name: 'Debater',
    summary:
      'Smart and curious thinkers who cannot resist an intellectual challenge.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/entp.png',
    app_image_src: require('../../assets/character/man-Debater.png'),
  },
  {
    code: 'enfj',
    name: 'Protagonist',
    summary:
      'Charismatic and inspiring leaders, able to mesmerize their listeners.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfj.png',
    app_image_src: require('../../assets/character/man-Protagonist.png'),
  },
  {
    code: 'enfp',
    name: 'Campaigner',
    summary:
      'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    image_src:
      'https://storage.googleapis.com/neris/public/images/types/enfp.png',
    app_image_src: require('../../assets/character/man-Campaigner.png'),
  }]