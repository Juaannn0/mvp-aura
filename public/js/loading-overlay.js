document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.getElementById('loadingOverlay');
  var progressBar = document.getElementById('loadingProgress');
  var message = document.getElementById('loadingMessage');
  var form = document.querySelector('.garment-form');
  var submitButton = form && form.querySelector('button[type="submit"]');
  var cancelLink = form && form.querySelector('a.btn-ghost');
  var inputs = form && Array.from(form.querySelectorAll('input, select, button, textarea, a'));
  var currentProgress = 0;
  var progressTimer = null;
  var messageTimer = null;
  var sequence = [
    'Uploading image...',
    'Removing background...',
    'Optimizing colors...',
    'Preparing wardrobe preview...',
    'Almost done...'
  ];
  var sequenceIndex = 0;

  function setDisabled(flag) {
    if (!inputs) return;
    inputs.forEach(function(control) {
      if (control.tagName === 'A') {
        control.style.pointerEvents = flag ? 'none' : '';
        control.style.opacity = flag ? '0.5' : '';
        control.style.cursor = flag ? 'not-allowed' : '';
      } else {
        control.disabled = flag;
        control.style.cursor = flag ? 'not-allowed' : '';
      }
    });
  }

  function showOverlay() {
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    sequenceIndex = 0;
    message.textContent = sequence[sequenceIndex];
    currentProgress = 8;
    updateProgress();
    setDisabled(true);
    startProgressLoop();
    startMessageLoop();
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    setDisabled(false);
    stopProgressLoop();
    stopMessageLoop();
  }

  function updateProgress() {
    if (!progressBar) return;
    progressBar.style.width = currentProgress + '%';
  }

  function startProgressLoop() {
    stopProgressLoop();
    progressTimer = setInterval(function() {
      if (currentProgress >= 90) return;
      currentProgress += Math.random() * 3;
      if (currentProgress > 90) currentProgress = 90;
      updateProgress();
    }, 300);
  }

  function stopProgressLoop() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function startMessageLoop() {
    stopMessageLoop();
    messageTimer = setInterval(function() {
      sequenceIndex = Math.min(sequenceIndex + 1, sequence.length - 1);
      message.textContent = sequence[sequenceIndex];
    }, 1500);
  }

  function stopMessageLoop() {
    if (messageTimer) {
      clearInterval(messageTimer);
      messageTimer = null;
    }
  }

  function completeOverlay(success) {
    if (!overlay) return;
    currentProgress = 100;
    updateProgress();
    message.textContent = success ? '✓ Garment processed successfully' : 'We couldn\'t process your image. Please try again.';
    if (success) {
      setTimeout(function() {
        hideOverlay();
        window.location.href = '/garments';
      }, 600);
    } else {
      setTimeout(function() {
        hideOverlay();
      }, 400);
    }
  }

  if (!form || !overlay || !submitButton) return;

  form.addEventListener('submit', function(event) {
    if (overlay.classList.contains('active')) {
      event.preventDefault();
      return;
    }

    showOverlay();

    var originalAction = form.action;
    var originalMethod = form.method || 'POST';
    var formData = new FormData(form);

    event.preventDefault();

    fetch(originalAction, {
      method: originalMethod,
      body: formData
    })
      .then(function(response) {
        if (!response.ok) throw new Error('Processing failed');
        return response.text();
      })
      .then(function() {
        completeOverlay(true);
      })
      .catch(function() {
        completeOverlay(false);
      });
  });
});
