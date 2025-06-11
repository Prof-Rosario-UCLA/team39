
import { getFacts, getFactsByID } from "$lib/server/crud";
import { json } from '@sveltejs/kit';

export async function GET({url}) {
    const cca3 = url.searchParams.get('cca3');
    console.log(cca3);

    if(cca3){
       const facts = await getFactsByID(cca3);
        return json({
            "cca3": cca3,
            "facts": facts
        });

    }else{
        const facts = await getFacts();

        return json({
            "facts": facts
        });
    }
	
}