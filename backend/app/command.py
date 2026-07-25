from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict

from .audio import SpeechInputAdapter, SpeechOutputAdapter
from .contracts import AgentRuntimeAdapter


COMMAND_PROTOCOL_VERSION = "1.1.0"


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CommandEndpoint(StrictModel):
    health: str
    coaching_websocket: str


class CommandCapabilities(StrictModel):
    text_streaming: bool
    interruption: bool
    camera_transport: bool
    camera_retention: Literal["none"]
    vision_reasoning: bool
    audio_input: bool
    audio_output: bool
    avatar_renderer: bool
    automatic_runtime_handoff: bool


class CommandSafetyBoundary(StrictModel):
    one_action_at_a_time: Literal[True]
    waits_for_confirmation: Literal[True]
    camera_food_safety_claims: Literal[False]
    camera_allergen_claims: Literal[False]
    camera_doneness_claims: Literal[False]


class CommandRuntime(StrictModel):
    provider: str
    model: str
    configured: bool


class CommandAdapterStatus(StrictModel):
    configured: bool
    provider: str | None
    model: str | None
    mime_types: tuple[str, ...]


class CommandAdapters(StrictModel):
    speech_input: CommandAdapterStatus
    speech_output: CommandAdapterStatus


class CommandManifest(StrictModel):
    service: Literal["captain-culinary-command"]
    protocol_version: str
    endpoints: CommandEndpoint
    capabilities: CommandCapabilities
    safety: CommandSafetyBoundary
    runtime: CommandRuntime
    adapters: CommandAdapters


def build_command_manifest(
    runtime: AgentRuntimeAdapter,
    speech_input: SpeechInputAdapter | None = None,
    speech_output: SpeechOutputAdapter | None = None,
) -> CommandManifest:
    """Describe the shared command surface without overstating unfinished adapters."""
    return CommandManifest(
        service="captain-culinary-command",
        protocol_version=COMMAND_PROTOCOL_VERSION,
        endpoints=CommandEndpoint(
            health="/health",
            coaching_websocket="/ws/coach/{session_id}",
        ),
        capabilities=CommandCapabilities(
            text_streaming=True,
            interruption=True,
            camera_transport=True,
            camera_retention="none",
            vision_reasoning=False,
            audio_input=bool(speech_input and speech_input.configured),
            audio_output=bool(speech_output and speech_output.configured),
            avatar_renderer=False,
            automatic_runtime_handoff=False,
        ),
        safety=CommandSafetyBoundary(
            one_action_at_a_time=True,
            waits_for_confirmation=True,
            camera_food_safety_claims=False,
            camera_allergen_claims=False,
            camera_doneness_claims=False,
        ),
        runtime=CommandRuntime(
            provider=runtime.provider,
            model=runtime.model,
            configured=runtime.configured,
        ),
        adapters=CommandAdapters(
            speech_input=CommandAdapterStatus(
                configured=bool(speech_input and speech_input.configured),
                provider=speech_input.provider if speech_input else None,
                model=speech_input.model if speech_input else None,
                mime_types=speech_input.accepted_mime_types if speech_input else (),
            ),
            speech_output=CommandAdapterStatus(
                configured=bool(speech_output and speech_output.configured),
                provider=speech_output.provider if speech_output else None,
                model=speech_output.model if speech_output else None,
                mime_types=(speech_output.output_mime_type,) if speech_output else (),
            ),
        ),
    )
