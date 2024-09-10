/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react'

// import { IReactListProps } from './IReactListProps';

const Test = () => {
	const [internalData, setInternalData] = React.useState<string[]>([]); 
    const [show,setShow] = React.useState<boolean>(false)

	const onLoadInternalData = (value: string[]): void => {
		const buff = value.map((x) => x + `${Math.random()}`);
		setInternalData(buff);
	};
	React.useEffect(() => {
		onLoadInternalData(["a", "b", "x"]);
	}, []);
    const rowEditHandler = (currentVAlue:string) =>{
        console.log(currentVAlue)
    }
    const rowDeleteHandler = (curr:string) => {
            const buff = [...internalData]
            const result = buff.filter(x => x !== curr)
            setInternalData(result)
    }
	return (
		<>
			{typeof internalData !== "undefined" && (
				<table>
					<tbody>
						{internalData?.map((x) => {
							return (
								<tr onMouseEnter={() => setShow(!show)} onMouseLeave={() => setShow(false)} key={Math.random()}>
									<td>{x}</td>
									<td>
										<button onClick={() => rowEditHandler(x)}>Edit</button>
									</td>
									<td>
										<button onClick={() => rowDeleteHandler(x)}>Delete</button>
									</td>
								</tr>
							);
						})}
					</tbody>
                    <tfoot>
                        {show && 
                        <tr>
                            <td>
                                :D:D:D:D:D:D:D:D
                            </td>
                        </tr>
                        }
                    </tfoot>
				</table>
			)}
		</>
	);
};
export{Test}