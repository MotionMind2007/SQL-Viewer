const noteArea = document.getElementById('note-area');
const downloadBtn = document.getElementById('download-btn');

// ডাউনলোড ফাংশন
downloadBtn.addEventListener('click', () => {
    const text = noteArea.value;
    if (!text.trim()) {
        alert("The note is empty! Write something and then download it!");
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const anchor = document.createElement('a');
    
    anchor.download = `motion_mind_note_${new Date().getTime()}.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
});