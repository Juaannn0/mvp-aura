document.addEventListener("DOMContentLoaded", function() {
  var overlay = document.getElementById("onboardingOverlay");
  var steps = Array.from(document.querySelectorAll(".onboarding-card"));
  var stepDots = Array.from(document.querySelectorAll(".onboarding-step"));
  var btnNext = document.getElementById("onboardingNext");
  var btnSkip = document.getElementById("onboardingSkip");
  var activeIndex = 0;

  function updateStep() {
    steps.forEach(function(card, index) {
      card.classList.toggle("onboarding-card--active", index === activeIndex);
    });
    stepDots.forEach(function(dot, index) {
      dot.classList.toggle("onboarding-step--active", index === activeIndex);
    });
    btnNext.textContent = activeIndex === steps.length - 1 ? "Finalizar" : "Siguiente";
  }

  function closeOnboarding() {
    overlay.classList.remove("active");
  }

  function completeOnboarding() {
    fetch("/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(function(response) {
        if (!response.ok) throw new Error("No se pudo completar el onboarding");
        closeOnboarding();
      })
      .catch(function(error) {
        console.error(error);
        closeOnboarding();
      });
  }

  if (!overlay || !btnNext || !btnSkip) return;

  if (window.showOnboarding === false) {
    overlay.classList.remove("active");
    return;
  }

  overlay.classList.add("active");
  updateStep();

  btnNext.addEventListener("click", function() {
    if (activeIndex < steps.length - 1) {
      activeIndex += 1;
      updateStep();
    } else {
      completeOnboarding();
    }
  });

  btnSkip.addEventListener("click", function() {
    completeOnboarding();
  });
});
