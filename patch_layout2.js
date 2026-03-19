const fs = require('fs');
let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

// Inject the import
const importStatement = `import { DisableInteraction } from "@/components/ui/disable-interaction";\n`;
if (!code.includes('DisableInteraction')) {
    code = code.replace(
        'import { UserProvider } from \'@auth0/nextjs-auth0/client\';',
        'import { UserProvider } from \'@auth0/nextjs-auth0/client\';\n' + importStatement
    );
}

// Inject into the body
if (!code.includes('<DisableInteraction />')) {
    code = code.replace(
        '<body className={`${inter.className} bg-black text-white antialiased`}>',
        '<body className={`${inter.className} bg-black text-white antialiased`}>\n                <DisableInteraction />'
    );
}

fs.writeFileSync('src/app/layout.tsx', code);
