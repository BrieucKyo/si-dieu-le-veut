import ANIMATIONS from '@/constants/ANIMATIONS'
import OTHERS from '@/constants/OTHERS'
import ORDALIES from '@/constants/ORDALIES'

const SOUNDS = {
  [ORDALIES.BBQ]: {
    INTRODUCTION: 'ordalie',
    DEATH: '',
  },
}

const ANIMATIONS_SOUNDS = {
  [OTHERS.SPLASHSCREEN]: {
    [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION1]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION2]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION3]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_LOCATION4]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_CUISINIER_SADIDLE]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_IDLE]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION2]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION3]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.SPLASHSCREEN.INTRO_GARDE_LOCATION4]: {
      frames: [
        {
          frame: 10,
          sound: 'boing',
        },
      ],
    },
  },
  [ORDALIES.BBQ]: {
    [ANIMATIONS.BBQ.IDLE]: {
      frames: [
        {
          frame: 20,
          sound: 'fire-hit',
        },
        {
          frame: 40,
          sound: 'fire-hit',
        },
      ],
    },
    [ANIMATIONS.BBQ.ENTREE]: {
      frames: [
        {
          frame: 1,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.BBQ.AVANCE]: {
      frames: [
        {
          frame: 1,
          sound: 'boing',
        },
      ],
    },
    [ANIMATIONS.BBQ.MORT]: {
      frames: [
        {
          frame: 1,
          sound: 'death',
        },
      ],
    },
    [ANIMATIONS.BBQ.SORTIE]: {
      frames: [
        {
          frame: 10,
          sound: 'oi',
        },
      ],
    },
  },
  [ORDALIES.CROIX]: {
    [ANIMATIONS.CROIX.FRONT_ENTREE]: {
      frames: [
        {
          frame: 40,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.CROIX.FRONT_SORTIE]: {
      frames: [
        {
          frame: 10,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.CROIX.FRONT_BRAS]: {
      frames: [
        {
          frame: 13,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.CROIX.FRONT_MORT]: {
      frames: [
        {
          frame: 10,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.CROIX.SIDE_ENTREE]: {
      frames: [
        {
          frame: 10,
          sound: 'oi',
        },
      ],
    },
    [ANIMATIONS.CROIX.SIDE_SORTIE]: {
      frames: [
        {
          frame: 10,
          sound: 'oi',
        },
      ],
    },
  },
}

export default ANIMATIONS_SOUNDS
