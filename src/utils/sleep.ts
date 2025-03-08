export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const sleepWithState = async (
    obj: Record<string, any>,
    key: string,
    ms: number,
) => {
    obj[key] = true
    await sleep(ms)
    obj[key] = false
}
