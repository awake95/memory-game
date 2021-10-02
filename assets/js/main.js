// variables
const card = document.querySelector( '.card' ),
  cards = card.querySelectorAll( '.card__item' ),
  time = document.querySelector( '.timer' ),
  buttonPlay = document.querySelector( '.button__play' ),
  buttonReset = document.querySelector( '.button__reset' );
let equalizer = [], card_first, card_second, same_cards, flag, gameWin;

// timer function
const startTimer = ( duration, display ) => {
  let timer = duration, minutes, seconds;
  let interval = setInterval( function () {
    minutes = parseInt( ( timer / 60 ).toString(), 10 );
    seconds = parseInt( ( timer % 60 ).toString(), 10 );

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.textContent = minutes + ':' + seconds;

    if ( --timer < 0 ) {
      timer = duration;
    }

    if ( gameWin ) {
      clearInterval( interval );
    }

    if ( timer === 0 ) {
      clearInterval( interval );
      let result = confirm( 'Time is off, do you want to reset game?' );

      if ( result ) {
        resetGameHandler();
        startTimer( 90, time );
      }

    }

  }, 1000 );
};

// get random number between arguments
const randomIntFromInterval = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
};

// get parent node
const getClosest = ( elem, selector ) => {
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }
  return null;
};

// get equals cards data id
const cardEqualizer = ( array ) => {
  if ( array.length === 2 ) {
    return array.reduce( ( previousValue, currentValue ) => previousValue === currentValue );
  } else {
    return false;
  }
};

// card click handler
const cardClickHandler = ( e ) => {

  let target = e.target;
  if ( !target.closest( '.card__item' ) ) return;

  let curTarget = getClosest( target, '.card__item' );
  curTarget.classList.add( 'active' );
  const dataId = curTarget.dataset.id;
  const dataCurrent = curTarget.dataset.current;

  if ( flag !== dataCurrent && equalizer.length > 0 && !curTarget.classList.contains( 'done' ) ) {
    equalizer.push( dataId );
    flag = dataCurrent;
  }

  if ( equalizer.length === 0 && !curTarget.classList.contains( 'done' ) ) {
    equalizer.push( dataId );
    flag = dataCurrent;
  }

  const equalizerFunc = cardEqualizer( equalizer );

  if ( equalizer.length === 2 ) {

    // if there is equal cards
    if ( equalizerFunc ) {
      same_cards = document.querySelectorAll( `.card_${ equalizer[ 0 ] }.active` );
      if ( same_cards ) {
        same_cards.forEach( item => {
          item.classList.add( 'done' );
        } );
      }
      equalizer = [];

      // checking if all cards is done
      const cardsLength = card.querySelectorAll( '.card__item' ).length;
      const cardsDoneLength = card.querySelectorAll( '.card__item.done' ).length;

      if ( cardsLength === cardsDoneLength ) {
        gameWin = true;
        buttonPlay.classList.add( 'hidden' );
        buttonReset.classList.remove( 'hidden' );
      }
    }

    // if there is no equal cards
    if ( !equalizerFunc ) {
      card.removeEventListener( 'click', cardClickHandler );

      setTimeout( function () {
        card_first = document.querySelector( `.card_${ equalizer[ 0 ] }.active` );
        card_second = document.querySelector( `.card_${ equalizer[ 1 ] }.active` );

        if ( card_first && card_second ) {
          card_first.classList.remove( 'active' );
          card_second.classList.remove( 'active' );
        }

        equalizer = [];
        card.addEventListener( 'click', cardClickHandler );
      }, 1000 );

    }
  }
};

// play memory game
const playClickHandler = ( e ) => {
  e.currentTarget.disabled = true;
  card.addEventListener( 'click', cardClickHandler );
  startTimer( 90, time );
};

// restart memory game
const resetGameHandler = () => {
  cards.forEach( item => {
    item.classList.remove( 'active', 'done' );
    item.style.order = randomIntFromInterval( 0, 20 ).toString();
  } );
  gameWin = false;
  buttonPlay.disabled = false;
  buttonPlay.classList.remove( 'hidden' );
  buttonReset.classList.add( 'hidden' );
  startTimer( 90, time );
};

// first cards loop
cards.forEach( ( item, index ) => {
  const image = item.querySelector( 'img' );
  const imageSrc = image.src.split( '/' );
  const imageNumber = imageSrc[ imageSrc.length - 1 ].match( /\d/g ).join( '' );

  item.style.order = randomIntFromInterval( 0, 20 ).toString();
  item.setAttribute( 'data-id', imageNumber );
  item.setAttribute( 'data-current', index.toString() );
  item.classList.add( 'card_' + imageNumber );

} );

// click assigns
buttonPlay.addEventListener( 'click', playClickHandler );
buttonReset.addEventListener( 'click', resetGameHandler );
