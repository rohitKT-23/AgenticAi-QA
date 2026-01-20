import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Agent System - Core Logic
class AgentSystem {
  constructor() {
    this.testCaseHistory = [];
    this.learningData = [];
  }

  // 1. Context Ingestion Agent
  async ingestContext(input) {
    console.log("🔍 Context Ingestion Agent: Processing input...");

    const context = {
      features: this.extractFeatures(input),
      actors: this.extractActors(input),
      inputs: this.extractInputs(input),
      outputs: this.extractOutputs(input),
      constraints: this.extractConstraints(input),
      rawInput: input.description,
    };

    return context;
  }

  extractFeatures(input) {
    const features = [];
    const text = input.description.toLowerCase();

    // Common feature keywords
    const featureKeywords = [
      "login",
      "upload",
      "download",
      "register",
      "reset",
      "search",
      "filter",
      "payment",
      "checkout",
      "profile",
    ];

    featureKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        features.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return features.length > 0 ? features : ["General Functionality"];
  }

  extractActors(input) {
    const actors = [];
    const text = input.description.toLowerCase();

    const actorKeywords = [
      "user",
      "admin",
      "customer",
      "guest",
      "visitor",
      "member",
    ];

    actorKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        actors.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    return actors.length > 0 ? actors : ["User"];
  }

  extractInputs(input) {
    const inputs = [];
    const text = input.description;

    // Extract file types
    const fileTypes = text.match(/\.(jpg|png|pdf|doc|csv|xml|json)/gi);
    if (fileTypes) inputs.push(...fileTypes.map((t) => t.toUpperCase()));

    // Extract size limits
    const sizes = text.match(/\d+\s*(mb|kb|gb)/gi);
    if (sizes) inputs.push(...sizes);

    // Common input types
    if (text.match(/email/i)) inputs.push("Email");
    if (text.match(/password/i)) inputs.push("Password");
    if (text.match(/phone/i)) inputs.push("Phone Number");

    return inputs;
  }

  extractOutputs(input) {
    const outputs = [];
    const text = input.description.toLowerCase();

    if (text.includes("error") || text.includes("fail"))
      outputs.push("Error Message");
    if (text.includes("success")) outputs.push("Success Message");
    if (text.includes("redirect")) outputs.push("Page Redirect");
    if (text.includes("email")) outputs.push("Email Notification");

    return outputs.length > 0 ? outputs : ["System Response"];
  }

  extractConstraints(input) {
    const constraints = [];
    const text = input.description;

    // Extract numeric constraints
    const numbers = text.match(/\d+/g);
    if (numbers) {
      numbers.forEach((num) => {
        if (text.includes(`${num}mb`) || text.includes(`${num} mb`)) {
          constraints.push(`Max size: ${num}MB`);
        }
        if (
          text.includes(`${num} characters`) ||
          text.includes(`${num}chars`)
        ) {
          constraints.push(`Max length: ${num} characters`);
        }
      });
    }

    return constraints;
  }

  // 2. Requirement Understanding Agent
  async understandRequirements(context) {
    console.log(
      "🧠 Requirement Understanding Agent: Analyzing requirements...",
    );

    const understanding = {
      feature: context.features[0] || "General Feature",
      rules: this.extractBusinessRules(context),
      assumptions: this.makeAssumptions(context),
      gaps: this.identifyGaps(context),
    };

    return understanding;
  }

  extractBusinessRules(context) {
    const rules = [];

    if (context.constraints.length > 0) {
      rules.push(...context.constraints);
    }

    if (
      context.rawInput.toLowerCase().includes("authenticated") ||
      context.rawInput.toLowerCase().includes("logged in")
    ) {
      rules.push("Authentication required");
    }

    if (context.rawInput.toLowerCase().includes("valid")) {
      rules.push("Input validation required");
    }

    return rules.length > 0 ? rules : ["Standard validation rules apply"];
  }

  makeAssumptions(context) {
    const assumptions = [];

    if (
      !context.rawInput.toLowerCase().includes("guest") &&
      !context.rawInput.toLowerCase().includes("anonymous")
    ) {
      assumptions.push("User authentication is required");
    }

    if (context.features.some((f) => f.toLowerCase().includes("upload"))) {
      assumptions.push("File type validation exists");
      assumptions.push("Virus scanning may be performed");
    }

    return assumptions;
  }

  identifyGaps(context) {
    const gaps = [];

    if (context.inputs.length === 0) {
      gaps.push("Input specifications not provided");
    }

    if (context.constraints.length === 0) {
      gaps.push("Constraints not specified");
    }

    return gaps;
  }

  // 3. Test Modeling Agent
  async createTestModels(understanding) {
    console.log("🧩 Test Modeling Agent: Creating test models...");

    const models = {
      stateTransitions: this.createStateModel(understanding),
      decisionTable: this.createDecisionTable(understanding),
      boundaryValues: this.createBoundaryModel(understanding),
      equivalenceClasses: this.createEquivalenceClasses(understanding),
    };

    return models;
  }

  createStateModel(understanding) {
    return {
      states: ["Initial", "Processing", "Success", "Error"],
      transitions: [
        { from: "Initial", to: "Processing", condition: "Valid input" },
        {
          from: "Processing",
          to: "Success",
          condition: "All validations pass",
        },
        { from: "Processing", to: "Error", condition: "Validation fails" },
      ],
    };
  }

  createDecisionTable(understanding) {
    return {
      conditions: understanding.rules,
      actions: ["Accept", "Reject", "Warn"],
    };
  }

  createBoundaryModel(understanding) {
    const boundaries = [];

    understanding.rules.forEach((rule) => {
      if (rule.includes("Max size:")) {
        const match = rule.match(/(\d+)/);
        if (match) {
          const limit = parseInt(match[1]);
          boundaries.push({
            parameter: "File Size",
            min: 0,
            max: limit,
            unit: "MB",
            testValues: [0, 1, limit - 1, limit, limit + 1],
          });
        }
      }
    });

    return boundaries;
  }

  createEquivalenceClasses(understanding) {
    return {
      valid: ["Within constraints", "Proper format", "Authorized user"],
      invalid: ["Exceeds limits", "Invalid format", "Unauthorized access"],
    };
  }

  // 4. Test Case Generation Agent
  async generateTestCases(models, understanding, context, options) {
    console.log("🧪 Test Case Generation Agent: Generating test cases...");

    const testCases = [];
    let idCounter = 1;

    // Functional Tests
    testCases.push(
      ...this.generateFunctionalTests(idCounter, understanding, context),
    );
    idCounter += testCases.length;

    // Negative Tests
    testCases.push(
      ...this.generateNegativeTests(idCounter, understanding, context),
    );
    idCounter = testCases.filter((tc) => tc.id).length + 1;

    // Boundary Tests
    if (models.boundaryValues.length > 0) {
      testCases.push(
        ...this.generateBoundaryTests(
          idCounter,
          models.boundaryValues,
          understanding,
        ),
      );
      idCounter = testCases.filter((tc) => tc.id).length + 1;
    }

    // Security Tests
    testCases.push(
      ...this.generateSecurityTests(idCounter, understanding, context),
    );

    return testCases;
  }

  generateFunctionalTests(startId, understanding, context) {
    const tests = [];
    const feature = understanding.feature;

    // Happy path
    tests.push({
      id: `TC-${String(startId).padStart(3, "0")}`,
      title: `${feature} - Valid scenario (Happy Path)`,
      type: "Functional",
      priority: "High",
      risk: "High",
      preconditions: understanding.assumptions,
      steps: [
        "Navigate to the feature",
        "Enter valid input data",
        "Submit the request",
        "Verify successful completion",
      ],
      expectedResult:
        "Operation completes successfully with appropriate confirmation",
      gherkin: this.generateGherkin(
        "Valid scenario",
        feature,
        "valid",
        "success",
      ),
    });

    return tests;
  }

  generateNegativeTests(startId, understanding, context) {
    const tests = [];
    const feature = understanding.feature;

    // Invalid input
    tests.push({
      id: `TC-${String(startId).padStart(3, "0")}`,
      title: `${feature} - Invalid input data`,
      type: "Negative",
      priority: "High",
      risk: "Medium",
      preconditions: understanding.assumptions,
      steps: [
        "Navigate to the feature",
        "Enter invalid input data",
        "Attempt to submit",
        "Verify error handling",
      ],
      expectedResult:
        "System displays appropriate error message and prevents invalid operation",
      gherkin: this.generateGherkin(
        "Invalid input",
        feature,
        "invalid",
        "error",
      ),
    });

    // Unauthorized access
    tests.push({
      id: `TC-${String(startId + 1).padStart(3, "0")}`,
      title: `${feature} - Unauthorized access attempt`,
      type: "Negative",
      priority: "High",
      risk: "High",
      preconditions: ["User is not authenticated"],
      steps: [
        "Attempt to access feature without authentication",
        "Verify access is denied",
      ],
      expectedResult:
        "System denies access and redirects to login or shows error",
      gherkin: this.generateGherkin(
        "Unauthorized access",
        feature,
        "unauthenticated",
        "denied",
      ),
    });

    return tests;
  }

  generateBoundaryTests(startId, boundaries, understanding) {
    const tests = [];
    const feature = understanding.feature;

    boundaries.forEach((boundary, idx) => {
      boundary.testValues.forEach((value, vIdx) => {
        const isValid = value >= boundary.min && value <= boundary.max;
        tests.push({
          id: `TC-${String(startId + idx * 5 + vIdx).padStart(3, "0")}`,
          title: `${feature} - ${boundary.parameter} = ${value}${boundary.unit}`,
          type: "Boundary",
          priority: "Medium",
          risk: "Medium",
          preconditions: understanding.assumptions,
          steps: [
            `Set ${boundary.parameter} to ${value}${boundary.unit}`,
            "Submit the request",
            "Verify system response",
          ],
          expectedResult: isValid
            ? "Operation succeeds"
            : `System rejects with error: ${boundary.parameter} out of range`,
          gherkin: this.generateGherkin(
            `Boundary test ${value}${boundary.unit}`,
            feature,
            `${boundary.parameter} is ${value}${boundary.unit}`,
            isValid ? "success" : "error",
          ),
        });
      });
    });

    return tests;
  }

  generateSecurityTests(startId, understanding, context) {
    const tests = [];
    const feature = understanding.feature;

    // SQL Injection
    tests.push({
      id: `TC-${String(startId).padStart(3, "0")}`,
      title: `${feature} - SQL Injection attempt`,
      type: "Security",
      priority: "Critical",
      risk: "Critical",
      preconditions: understanding.assumptions,
      steps: [
        "Navigate to the feature",
        "Enter SQL injection payload (e.g., ' OR '1'='1)",
        "Submit the request",
        "Verify input is sanitized",
      ],
      expectedResult: "System sanitizes input and prevents SQL injection",
      gherkin: this.generateGherkin(
        "SQL injection prevention",
        feature,
        "malicious SQL",
        "sanitized",
      ),
    });

    // XSS
    tests.push({
      id: `TC-${String(startId + 1).padStart(3, "0")}`,
      title: `${feature} - XSS attack prevention`,
      type: "Security",
      priority: "Critical",
      risk: "Critical",
      preconditions: understanding.assumptions,
      steps: [
        "Navigate to the feature",
        'Enter XSS payload (e.g., <script>alert("XSS")</script>)',
        "Submit the request",
        "Verify script is not executed",
      ],
      expectedResult: "System escapes HTML and prevents script execution",
      gherkin: this.generateGherkin(
        "XSS prevention",
        feature,
        "malicious script",
        "escaped",
      ),
    });

    return tests;
  }

  generateGherkin(scenario, feature, given, then) {
    return `Feature: ${feature}

Scenario: ${scenario}
  Given user has ${given}
  When user performs the action
  Then system should ${then}`;
  }

  // 5. Coverage & Risk Validation Agent
  async validateCoverage(testCases, models) {
    console.log("📊 Coverage Validation Agent: Analyzing coverage...");

    const coverage = {
      functional: testCases.filter((tc) => tc.type === "Functional").length,
      negative: testCases.filter((tc) => tc.type === "Negative").length,
      boundary: testCases.filter((tc) => tc.type === "Boundary").length,
      security: testCases.filter((tc) => tc.type === "Security").length,
      total: testCases.length,
      score: this.calculateCoverageScore(testCases),
      missing: this.identifyMissingCoverage(testCases, models),
      risk: this.assessRisk(testCases),
    };

    return coverage;
  }

  calculateCoverageScore(testCases) {
    const weights = {
      Functional: 0.3,
      Negative: 0.3,
      Boundary: 0.2,
      Security: 0.2,
    };

    let score = 0;
    Object.keys(weights).forEach((type) => {
      const count = testCases.filter((tc) => tc.type === type).length;
      if (count > 0) score += weights[type] * 100;
    });

    return Math.round(score);
  }

  identifyMissingCoverage(testCases, models) {
    const missing = [];

    if (!testCases.some((tc) => tc.type === "Performance")) {
      missing.push("Performance tests");
    }

    if (!testCases.some((tc) => tc.title.includes("concurrent"))) {
      missing.push("Concurrency tests");
    }

    return missing;
  }

  assessRisk(testCases) {
    const criticalCount = testCases.filter(
      (tc) => tc.risk === "Critical",
    ).length;
    const highCount = testCases.filter((tc) => tc.risk === "High").length;

    if (criticalCount > 0) return "High";
    if (highCount > 3) return "Medium";
    return "Low";
  }

  // Main orchestration
  async generateTests(input) {
    try {
      // Step 1: Ingest context
      const context = await this.ingestContext(input);

      // Step 2: Understand requirements
      const understanding = await this.understandRequirements(context);

      // Step 3: Create test models
      const models = await this.createTestModels(understanding);

      // Step 4: Generate test cases
      const testCases = await this.generateTestCases(
        models,
        understanding,
        context,
        input.options,
      );

      // Step 5: Validate coverage
      const coverage = await this.validateCoverage(testCases, models);

      // Store in history
      const result = {
        timestamp: new Date().toISOString(),
        input: input.description,
        context,
        understanding,
        models,
        testCases,
        coverage,
      };

      this.testCaseHistory.push(result);

      return result;
    } catch (error) {
      console.error("Error in test generation:", error);
      throw error;
    }
  }

  // Export functionality
  exportToFormat(testCases, format) {
    switch (format) {
      case "gherkin":
        return testCases.map((tc) => tc.gherkin).join("\n\n---\n\n");

      case "json":
        return JSON.stringify(testCases, null, 2);

      case "markdown":
        return this.exportToMarkdown(testCases);

      case "csv":
        return this.exportToCSV(testCases);

      default:
        return JSON.stringify(testCases, null, 2);
    }
  }

  exportToMarkdown(testCases) {
    let md = "# Test Cases\n\n";

    testCases.forEach((tc) => {
      md += `## ${tc.id}: ${tc.title}\n\n`;
      md += `**Type:** ${tc.type}  \n`;
      md += `**Priority:** ${tc.priority}  \n`;
      md += `**Risk:** ${tc.risk}  \n\n`;
      md += `**Preconditions:**\n`;
      tc.preconditions.forEach((pre) => (md += `- ${pre}\n`));
      md += `\n**Steps:**\n`;
      tc.steps.forEach((step, idx) => (md += `${idx + 1}. ${step}\n`));
      md += `\n**Expected Result:** ${tc.expectedResult}\n\n`;
      md += "---\n\n";
    });

    return md;
  }

  exportToCSV(testCases) {
    let csv =
      "ID,Title,Type,Priority,Risk,Preconditions,Steps,Expected Result\n";

    testCases.forEach((tc) => {
      csv += `"${tc.id}","${tc.title}","${tc.type}","${tc.priority}","${tc.risk}",`;
      csv += `"${tc.preconditions.join("; ")}","${tc.steps.join("; ")}","${tc.expectedResult}"\n`;
    });

    return csv;
  }
}

// Initialize agent system
const agentSystem = new AgentSystem();

// API Routes
app.post("/api/generate", async (req, res) => {
  try {
    const result = await agentSystem.generateTests(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/export", (req, res) => {
  try {
    const { testCases, format } = req.body;
    const exported = agentSystem.exportToFormat(testCases, format);
    res.json({ data: exported });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/history", (req, res) => {
  res.json(agentSystem.testCaseHistory);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agentic Test Generator running on http://localhost:${PORT}`);
  console.log(`📊 Multi-agent system initialized with 7 specialized agents`);
});
