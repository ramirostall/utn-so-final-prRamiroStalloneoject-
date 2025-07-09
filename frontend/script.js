// Función para cargar estudiantes (reutilizable)
async function loadStudents() {
  const response = await fetch("/api/students");
  const students = await response.json();
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${student.id}</td><td>${student.name}</td>`;
    tbody.appendChild(row);
  });
}

// Event listener para el formulario de agregar estudiante
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const nameInput = document.getElementById("studentNameInput");
  const messageDiv = document.getElementById("addStudentMessage");
  const name = nameInput.value.trim();
  
  if (!name) {
    messageDiv.textContent = "Por favor, ingresa un nombre";
    messageDiv.style.color = "red";
    return;
  }
  
  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      messageDiv.textContent = `Estudiante "${data.name}" agregado exitosamente`;
      messageDiv.style.color = "green";
      nameInput.value = ""; // Limpiar el input
      
      // Recargar automáticamente la tabla de estudiantes
      await loadStudents();
    } else {
      messageDiv.textContent = data.error || "Error al agregar estudiante";
      messageDiv.style.color = "red";
    }
  } catch (error) {
    messageDiv.textContent = "Error de conexión";
    messageDiv.style.color = "red";
  }
});

// Modificar el event listener existente para usar la función reutilizable
document.getElementById("loadButton").addEventListener("click", loadStudents);

// Event listener para el botón de saludo
document.getElementById("greetButton").addEventListener("click", async () => {
  const nameInput = document.getElementById("nameInput");
  const greetMessage = document.getElementById("greetMessage");
  const name = nameInput.value.trim();
  
  if (!name) {
    greetMessage.textContent = "Por favor, ingresa un nombre";
    greetMessage.style.color = "red";
    return;
  }
  
  try {
    const response = await fetch(`/api/greet?name=${encodeURIComponent(name)}`);
    const data = await response.json();
    greetMessage.textContent = data.message;
    greetMessage.style.color = "green";
  } catch (error) {
    greetMessage.textContent = "Error al obtener el saludo";
    greetMessage.style.color = "red";
  }
});
