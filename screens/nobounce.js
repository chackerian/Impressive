var handleTouchmove = function(evt) {
	evt.preventDefault();
};

var enable = function() {
	var swipe = document.getElementsByClassName("swipeMain")
	console.log(document, window)
	swipe.addEventListener('touchmove', handleTouchmove, { passive : false });
};

// Test for webkit-overflow-scrolling
var testDiv = document.createElement('div');
document.documentElement.appendChild(testDiv);
testDiv.style.WebkitOverflowScrolling = 'touch';
var scrollSupport = 'getComputedStyle' in window && window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
document.documentElement.removeChild(testDiv);

if (scrollSupport) {
	enable();
}