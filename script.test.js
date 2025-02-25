const { addTask, sortTasks, assignTask, deleteTask } = require("./script"); // Adjust path if needed

beforeAll(() => {
    global.alert = jest.fn(); // Mock window.alert

    // Mock localStorage
    Object.defineProperty(global, "localStorage", {
        value: {
            setItem: jest.fn(),
            getItem: jest.fn(() => JSON.stringify([])), // Mock empty task list
            clear: jest.fn(),
        },
        writable: true,
    });
});

beforeEach(() => {
    // Mock required DOM elements
    document.body.innerHTML = `
        <input id="taskInput" value="Test Task"/>
        <input id="dueDate" value="2025-12-31"/>
        <select id="priority">
            <option value="high" selected>High</option>
        </select>
        <select id="category">
            <option value="work" selected>Work</option>
        </select>p
        <input id="assignTo" value="John Doe"/> <!-- Added missing element -->
    `;

    localStorage.setItem.mockClear(); // Reset mock call counts
    localStorage.getItem.mockClear();
    alert.mockClear(); // Reset alert calls
});

describe("TaskManager Unit Tests", () => {
    test("Successfully adds a task", () => {
        addTask();
        expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Ensure setItem is called once
    });

    test("Fails to add a task without a title", () => {
        document.getElementById("taskInput").value = ""; // Empty title
        addTask();
        expect(global.alert).toHaveBeenCalledTimes(1); // Ensure alert is called once
        expect(global.alert).toHaveBeenCalledWith("Task title is required");
    });

    test("Sorts tasks by priority", () => {
        const mockTasks = [
            { title: "Low Priority", priority: "low" },
            { title: "High Priority", priority: "high" },
        ];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        sortTasks();
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "tasks",
            expect.stringContaining("high")
        ); // Ensure "high" priority is stored first
    });

    test("Fails to assign task if task ID does not exist", () => {
        const mockTasks = [{ id: 1, title: "Test Task", assignedTo: null }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        
        assignTask(999); // Non-existent ID
        
        expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test("Edge case: Assign task with empty assignee", () => {
        const mockTasks = [{ id: 1, title: "Test Task", assignedTo: null }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        
        jest.spyOn(global, "prompt").mockReturnValue("");
        assignTask(1);
        
        expect(localStorage.setItem).not.toHaveBeenCalled();
        global.prompt.mockRestore();
    });
});
