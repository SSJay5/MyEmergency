/*eslint-disable*/
const spinnerAddColor = (color) => {
  const l2 = document.createElement('div');
  l2.className = `spinner-layer spinner-${color}`;
  // console.log(l2);
  const l3 = document.createElement('div');
  l3.className = 'circle-clipper left';
  const l31 = document.createElement('div');
  l31.className = 'circle';
  l3.appendChild(l31);
  // console.log(l3);
  const l4 = document.createElement('div');
  l4.className = 'gap-patch';
  const l41 = document.createElement('div');
  l41.className = 'circle';
  l4.appendChild(l41);
  const l5 = document.createElement('div');
  l5.className = 'circle-clipper right';
  const l51 = document.createElement('div');
  l51.className = 'circle';
  l5.appendChild(l51);
  l2.appendChild(l3);
  l2.appendChild(l4);
  l2.appendChild(l5);
  return l2;
};

export const spinner = (type) => {
  if (type === 'add') {
    const L1 = document.createElement('div');
    L1.id = 'sipnnerEmergency';
    // console.log(L1);
    const L2 = document.createElement('div');
    L2.className = 'spinner-container';
    // console.log(L2);
    const l1 = document.createElement('div');
    l1.className = 'preloader-wrapper big active';
    l1.appendChild(spinnerAddColor('blue'));
    l1.appendChild(spinnerAddColor('red'));
    l1.appendChild(spinnerAddColor('yellow'));
    l1.appendChild(spinnerAddColor('green'));
    console.log(l1);
    L2.appendChild(l1);
    L1.appendChild(L2);
    document.getElementsByClassName('emergencyMap')[0].appendChild(L1);
  } else {
    document.getElementById('sipnnerEmergency').remove();
  }
};
