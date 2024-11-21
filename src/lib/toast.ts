interface ToastOptions {
  title: string;
  description?: string;
  status: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  isClosable?: boolean;
}

let toastContainer: HTMLDivElement | null = null;

function createToastContainer() {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function createToastElement(options: ToastOptions) {
  const toast = document.createElement('div');
  const statusColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  
  toast.className = `${statusColors[options.status]} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out flex items-center gap-2`;
  
  const content = document.createElement('div');
  content.className = 'flex flex-col';
  
  const title = document.createElement('div');
  title.className = 'font-medium';
  title.textContent = options.title;
  content.appendChild(title);
  
  if (options.description) {
    const description = document.createElement('div');
    description.className = 'text-sm opacity-90';
    description.textContent = options.description;
    content.appendChild(description);
  }
  
  toast.appendChild(content);
  
  if (options.isClosable) {
    const closeButton = document.createElement('button');
    closeButton.className = 'ml-auto text-white hover:text-gray-200';
    closeButton.innerHTML = '✕';
    closeButton.onclick = () => toast.remove();
    toast.appendChild(closeButton);
  }
  
  return toast;
}

export function toast(options: ToastOptions) {
  const container = createToastContainer();
  const toastElement = createToastElement(options);
  
  // Add toast with animation
  toastElement.style.opacity = '0';
  toastElement.style.transform = 'translateY(1rem)';
  container.appendChild(toastElement);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';
  });
  
  // Auto remove after duration
  if (options.duration !== 0) {
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateY(1rem)';
      setTimeout(() => toastElement.remove(), 300);
    }, options.duration || 3000);
  }
  
  return {
    close: () => toastElement.remove()
  };
}
