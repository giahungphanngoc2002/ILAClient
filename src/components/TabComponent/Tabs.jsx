const Tabs = ({ activeTab, setActiveTab }) => {
    return (
      <div className="tabs">
        <button
          className={`tab ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          Questions
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`tab ${activeTab === "test" ? "active" : ""}`}
          onClick={() => setActiveTab("test")}
        >
          Test
        </button>
        <button
          className={`tab ${activeTab === "student" ? "active" : ""}`}
          onClick={() => setActiveTab("student")}
        >
          Students
        </button>
      </div>
    );
  };
  
  export default Tabs;
  