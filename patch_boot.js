const fs = require('fs');
let code = fs.readFileSync('src/components/ui/boot-sequence.tsx', 'utf8');

code = code.replace(
    'className={`${line.includes(\'[OK]\') ? \'text-green-400\' : line.includes(\'INIT\') || line.includes(\'SYSTEM\') ? \'text-cyan-400 font-bold\' : \'text-zinc-400\'}`}',
    'className={`${line?.includes(\'[OK]\') ? \'text-green-400\' : line?.includes(\'INIT\') || line?.includes(\'SYSTEM\') ? \'text-cyan-400 font-bold\' : \'text-zinc-400\'}`}'
);

fs.writeFileSync('src/components/ui/boot-sequence.tsx', code);
