const LS_USE_BLACK_CARDS = 'LS_USE_BLACK_CARDS';

export function getCardResource(cardStr: string) {
  let styleStr = '';
  if (localStorage.getItem(LS_USE_BLACK_CARDS) != null) {
    styleStr = localStorage.getItem(LS_USE_BLACK_CARDS) === 'true' ? '_black' : '';
  }
  const suit = getSuit(cardStr);
  const value = getValue(cardStr);
  if (suit === undefined || suit === '' || value === undefined || value === '') return '';

  return `card_${suit}_${value}${styleStr}.png`;
}

function getSuit(cardStr: string): string {
  if (!cardStr) return '';
  if (cardStr.indexOf('♠') !== -1) {
    // Spades
    return 'spades';
  }
  if (cardStr.indexOf('♥') !== -1) {
    // Hearts
    return 'hearts';
  }
  if (cardStr.indexOf('♣') !== -1) {
    // Clubs
    return 'clubs';
  }
  if (cardStr.indexOf('♦') !== -1) {
    // Diamonds
    return 'diamonds';
  }
  return '';
}

function getValue(cardStr: string) {
  if (!cardStr) return '';
  if (cardStr.indexOf('2') !== -1) {
    return 'two';
  }
  if (cardStr.indexOf('3') !== -1) {
    return 'three';
  }
  if (cardStr.indexOf('4') !== -1) {
    return 'four';
  }
  if (cardStr.indexOf('5') !== -1) {
    return 'five';
  }
  if (cardStr.indexOf('6') !== -1) {
    return 'six';
  }
  if (cardStr.indexOf('7') !== -1) {
    return 'seven';
  }
  if (cardStr.indexOf('8') !== -1) {
    return 'eight';
  }
  if (cardStr.indexOf('9') !== -1) {
    return 'nine';
  }
  if (cardStr.indexOf('10') !== -1) {
    return 'ten';
  }
  if (cardStr.indexOf('J') !== -1) {
    return 'eleven';
  }
  if (cardStr.indexOf('Q') !== -1) {
    return 'twelve';
  }
  if (cardStr.indexOf('K') !== -1) {
    return 'thirteen';
  }
  if (cardStr.indexOf('A') !== -1) {
    return 'fourteen';
  }

  return '';
}
