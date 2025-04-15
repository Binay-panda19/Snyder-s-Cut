(() => {
    'use strict';
  
    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();
  
// Image upload preview
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("imageUpload");
    const preview = document.getElementById("previewImage");
  
    if (input && preview) {
      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
  
  

  
    // Webcam logic
    document.addEventListener("DOMContentLoaded", () => {
        const video = document.getElementById("video");
        const canvas = document.getElementById("canvas");
        const capturedImage = document.getElementById("capturedImage");
        const capturedDataInput = document.getElementById("capturedData");
        const startBtn = document.getElementById("startCamera");
        const stopBtn = document.getElementById("stopCamera");
        const captureBtn = document.getElementById("capture");
        const uploadBtn = document.getElementById("uploadBtn");
    
        let currentStream = null;
    
        if (startBtn && video) {
            startBtn.addEventListener("click", async () => {
                try {
                    currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    video.srcObject = currentStream;
    
                    captureBtn.disabled = false;
                    stopBtn.disabled = false;
                    startBtn.disabled = true;
                } catch (err) {
                    alert("Could not access the camera. Please allow webcam permissions.");
                }
            });
        }
    
        if (stopBtn) {
            stopBtn.addEventListener("click", () => {
                if (currentStream) {
                    currentStream.getTracks().forEach(track => track.stop());
                    video.srcObject = null;
                    currentStream = null;
    
                    startBtn.disabled = false;
                    stopBtn.disabled = true;
                    captureBtn.disabled = true;
    
                    capturedImage.style.display = "none";
                    uploadBtn.style.display = "none";
                }
            });
        }
    
        if (captureBtn) {
            captureBtn.addEventListener("click", () => {
                if (!currentStream) return;
    
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                const imageData = canvas.toDataURL("image/png");
    
                capturedImage.src = imageData;
                capturedImage.style.display = "block";
                uploadBtn.style.display = "inline-block";
    
                if (capturedDataInput) {
                    capturedDataInput.value = imageData;
                }

                const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    if (!capturedDataInput.value) {
      e.preventDefault();
      alert("Please capture an image first!");
    }
  });
}

            });
        }
    });
      
  // Hairstyle recommendation utility
  function getHairstyles(shape) {
    const ideas = {
      oval: ["Textured Crop", "Pompadour", "Buzz Cut"],
      round: ["Faux Hawk", "Quiff", "High Fade"],
      square: ["Undercut", "Slick Back", "Side Part"],
      heart: ["Fringe", "Taper Fade", "Layered Cut"],
      oblong: ["Crew Cut", "Side Swept", "Comb Over"]
    };
    return ideas[shape] || ["Default Cut"];
  }