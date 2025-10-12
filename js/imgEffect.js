let lightBundle = document.querySelectorAll(".light");
let imgWindowBundle = document.querySelectorAll(".window");

const ACTIVATION_DISTANCE = 400;
const CLIP_MAX_RADIUS = 150;
const MAX_SCALE = 1.02;

const TRANSITION_MOUSEMOVE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const TRANSITION_IMG_CLICK = 'cubic-bezier(.68,.2,.12,1.29)';
const TRANSITION_IMG_RESET = 'cubic-bezier(0.68, 0.2, 0.25, 1.42)';

const targetX = window.innerWidth/2 - 150;
const targetY = window.innerHeight/3 - 150;

let activeImg = null;

document.addEventListener('mousemove', (event) => {
	let mouseX = event.clientX;
	let mouseY = event.clientY;
	
	lightBundle.forEach(light => {
		let lightRect = light.getBoundingClientRect();
		let lightCenterX = lightRect.left + lightRect.width / 2;
		let lightCenterY = lightRect.top + lightRect.height / 2;
		
		let distanceX = mouseX - lightCenterX;
		let distanceY = mouseY - lightCenterY;
		let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		
		if(distance <= ACTIVATION_DISTANCE){
			let newShadow = '';
			let intensity = 1 - (distance / ACTIVATION_DISTANCE);
			
			let clipSize = (1 - distance / ACTIVATION_DISTANCE) * CLIP_MAX_RADIUS;
			let clipX = (mouseX - lightRect.left) / lightRect.width * 100;
			let clipY = (mouseY - lightRect.top) / lightRect.height * 100;
			
			light.style.clipPath = `circle(${clipSize}% at ${clipX}% ${clipY}%)`;
			
			for (let i = 0; i < 20; i++) {
				let shadowX = distanceX * (i / 1500) * intensity;
				let shadowY = distanceY * (i / 1500) * intensity;
				let shadowZ = distance * (i / 300) * intensity;
				let opacity = (1 - i / 20) * intensity;
				
				newShadow += (newShadow ? ',' : '') + `${shadowX}px ${shadowY}px ${shadowZ}px rgba(255, 255, 255, ${opacity})`;
			}
			
			light.style.boxShadow = newShadow;
		} else {
			light.style.clipPath = 'circle(0% at 50% 50%)';
			light.style.boxShadow = '';
		}
	});
	
	imgWindowBundle.forEach(window => {
		if (window.classList.contains('active')) return;
		
		let rect = window.getBoundingClientRect();
		let centerX = rect.left + rect.width / 2;
		let centerY = rect.top + rect.height / 2;
		
		let distanceX = mouseX - centerX;
		let distanceY = mouseY - centerY;
		let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
		
		if(distance <= ACTIVATION_DISTANCE){
			let intensity = 1 - (distance / ACTIVATION_DISTANCE);
			let scale = 1 + (MAX_SCALE - 1) * intensity;
			
			window.style.transform = `scale(${scale})`;
			window.style.transition = `transform 0.1s ${TRANSITION_MOUSEMOVE}`;
		} else {
			window.style.transform = 'scale(1)';
		}
	});
});

imgWindowBundle.forEach(img => {
	img.addEventListener('click', () => {
		if (activeImg && activeImg !== img) {
			activeImg.style.transition = `transform 0.6s ${TRANSITION_IMG_RESET}`;
			activeImg.style.transform = 'translate(0px, 0px) scale(1)';
			activeImg.classList.remove('active');
		}
		
		if (activeImg === img) {
			img.style.transition = `transform 0.6s ${TRANSITION_IMG_RESET}`;
			img.style.transform = 'translate(0px, 0px) scale(1)';
			img.classList.remove('active');
			activeImg = null;
			return;
		}
		
		activeImg = img;
		
		const rect = img.getBoundingClientRect();
		const moveX = targetX - rect.left;
		const moveY = targetY - rect.top;
		
		img.style.transition = `transform 0.6s ${TRANSITION_IMG_CLICK}`;
		img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.2)`;
		img.classList.add('active');
	});
});

document.addEventListener('click', (e) => {
	if (!e.target.closest('.window') && activeImg) {
		activeImg.style.transition = `transform 0.6s ${TRANSITION_IMG_RESET}`;
		activeImg.style.transform = 'translate(0px, 0px) scale(1)';
		activeImg.classList.remove('active');
		activeImg = null;
	}
});