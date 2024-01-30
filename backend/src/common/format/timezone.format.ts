export function convertToSeoulTimezone(date: Date): Date {
  const utcOffset = date.getTimezoneOffset(); // UTC에서의 오프셋
  const seoulOffset = 9 * 60; // Seoul은 UTC+9
  const seoulTime = date.getTime() + (seoulOffset - utcOffset) * 60 * 1000; // 밀리초로 변환

  return new Date(seoulTime);
}
