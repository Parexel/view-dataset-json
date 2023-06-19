/* eslint-disable no-console */
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JSONStream from 'JSONStream';

const getMetadata = async (
    path: string
): Promise<{ [name: string]: string | object }> => {
    const stream = fs.createReadStream(path, { encoding: 'utf8' });
    const result: { [name: string]: string | object } = {};
    const parsedElements = {
        records: false,
        name: false,
        label: false,
        items: false,
    };
    console.time();
    stream
        .pipe(
            JSONStream.parse(
                [
                    /clinicalData|referenceData/,
                    true,
                    true,
                    /name|label|items|records/,
                ],
                (data: string, nodePath: string) => {
                    return { path: nodePath, value: data };
                }
            )
        )
        .on('end', () => {
            console.log('Finished reading');
        })
        .on('close', () => {
            console.log('Closed');
        })
        .on('data', (data: { path: string; value: string }) => {
            const key = data.path[data.path.length - 1];

            if (Object.keys(parsedElements).includes(key)) {
                result[key] = data.value;
                parsedElements[key as 'name' | 'label' | 'records' | 'items'] =
                    true;
                if (
                    Object.values(parsedElements).every((item) => item === true)
                ) {
                    console.log('Destroying');
                }
            }
        });

    return result;
};

export default getMetadata;

getMetadata('C:\\core\\DataExchange-DatasetJson\\examples\\adam\\test.json');
