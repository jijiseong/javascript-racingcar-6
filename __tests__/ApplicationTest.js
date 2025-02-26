import { MissionUtils } from '@woowacourse/mission-utils';
import App from '../src/App';
import printWinners from '../src/functions/startRacing/printWinners';
import { getLogSpy, mockQuestions } from '../src/utils/testUtils';

const mockRandoms = (numbers) => {
  MissionUtils.Random.pickNumberInRange = jest.fn();
  numbers.reduce(
    (acc, number) => acc.mockReturnValueOnce(number),
    MissionUtils.Random.pickNumberInRange,
  );
};

describe('자동차 경주 게임', () => {
  test('전진-정지', async () => {
    // given
    const MOVING_FORWARD = 4;
    const STOP = 3;
    const inputs = ['pobi,woni', '1'];
    const outputs = ['pobi : -'];
    const randoms = [MOVING_FORWARD, STOP];
    const logSpy = getLogSpy();

    mockQuestions(inputs);
    mockRandoms([...randoms]);

    // when
    const app = new App();
    await app.play();

    // then
    outputs.forEach((output) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(output));
    });
  });

  test.each([[['pobi,javaji']], [['pobi,eastjun']]])(
    '이름에 대한 예외 처리',
    async (inputs) => {
      // given
      mockQuestions(inputs);

      // when
      const app = new App();

      // then
      await expect(app.play()).rejects.toThrow('[ERROR]');
    },
  );

  test('우승자 출력', () => {
    // given
    const input = ['car1', 'car3'];
    const result = '최종 우승자 : car1, car3';
    const logSpy = getLogSpy();

    // when
    printWinners(input);

    // then
    expect(logSpy).toHaveBeenCalledWith(result);
  });
});
