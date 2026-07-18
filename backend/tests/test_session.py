import asyncio

from app.session import CoachSession


def test_interrupt_cancels_active_response() -> None:
    async def scenario() -> None:
        started = asyncio.Event()

        async def response() -> None:
            started.set()
            await asyncio.Event().wait()

        session = CoachSession("session")
        session.response_task = asyncio.create_task(response())
        await started.wait()
        assert await session.interrupt() is True
        assert session.response_task is None
        assert session.generation == 1

    asyncio.run(scenario())
