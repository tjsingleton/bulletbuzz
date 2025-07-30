// Initialize Mermaid diagrams
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Mermaid
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true
    }
  });
  
  // Find all mermaid diagrams and render them
  const mermaidElements = document.querySelectorAll('.mermaid');
  mermaidElements.forEach(function(element) {
    if (element.querySelector('code')) {
      const code = element.querySelector('code').textContent;
      mermaid.render('mermaid-' + Math.random().toString(36).substr(2, 9), code).then(function(result) {
        element.innerHTML = result.svg;
      });
    }
  });
}); 