const fs = require('fs');
let code = fs.readFileSync('src/app/reasoning/page.tsx', 'utf8');

code = code.replace(
    'const [isLoading, setIsLoading] = useState(true);',
    'const [isLoading, setIsLoading] = useState(true);\n    const [dataSource, setDataSource] = useState<\'mock\' | \'real\'>(\'mock\');'
);

code = code.replace(
    'thought: data.chain_of_thought,',
    'thought: data.chain_of_thought || JSON.stringify(data.reasoning_chain),'
);

code = code.replace(
    'confidence: data.confidence_score * 100,',
    'confidence: data.confidence_score ? data.confidence_score * 100 : data.confidence * 100,'
);

code = code.replace(
    'status: data.confidence_score > 0.8 ? \'safe\' : \'alert\',',
    'status: (data.confidence_score || data.confidence) > 0.8 ? \'safe\' : \'alert\','
);

code = code.replace(
    '                    ...originalTimeline.slice(2)\n                ]);\n            } else {',
    '                    ...originalTimeline.slice(2)\n                ]);\n                setDataSource(\'real\');\n            } else {'
);

code = code.replace(
    '                setBackendTimeline(originalTimeline);\n            }\n        } catch (error) {',
    '                setBackendTimeline(originalTimeline);\n                setDataSource(\'mock\');\n            }\n        } catch (error) {'
);

code = code.replace(
    '            setBackendTimeline(originalTimeline);\n        } finally {',
    '            setBackendTimeline(originalTimeline);\n            setDataSource(\'mock\');\n        } finally {'
);

code = code.replace(
    '<Badge color="cyan" variant="neutral">XAI MODE: ACTIVE</Badge>',
    '<div className="flex gap-2"><Badge color={dataSource === "real" ? "success" : "warning"} variant="neutral">{dataSource === "real" ? "REAL MOJO DATA" : "MOCK DATA"}</Badge><Badge color="cyan" variant="neutral">XAI MODE: ACTIVE</Badge></div>'
);

code = code.replace(
    'const [isAttackMode, setIsAttackMode] = useState(false);',
    'const [isAttackMode, setIsAttackMode] = useState(false); // To let user test the agent'
)

fs.writeFileSync('src/app/reasoning/page.tsx', code);
