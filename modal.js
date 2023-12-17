function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

window.addEventListener('click', function(event) {
  var modals = document.getElementsByClassName('modal');
  for (var i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].style.display = 'none';
    }
  }
});

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

document.getElementById('btn1').addEventListener('click', function() {
  openModal('modal1');
});

document.getElementById('btn2').addEventListener('click', function() {
  openModal('modal2');
});

document.getElementById('btn3').addEventListener('click', function() {
  openModal('modal3');
});

document.getElementById('btn4').addEventListener('click', function() {
  openModal('modal4');
});
