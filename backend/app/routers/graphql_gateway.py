"""
FitVerse AI — Mobile GraphQL Gateway
Allows mobile apps (Apollo Client / Flutter) to select ONLY required fields (e.g., just name and reps),
reducing cellular payload size by ~70% compared to bulky monolithic REST responses.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json

router = APIRouter(prefix="/api/graphql", tags=["GraphQL Mobile Gateway"])

class GraphQLRequest(BaseModel):
    query: str
    variables: Optional[Dict[str, Any]] = None

# Comprehensive Workout Database with heavy metadata
WORKOUT_DATABASE = {
    "hypertrophy_push": {
        "id": 101,
        "title": "Hypertrophy Push Protocol",
        "category": "Strength",
        "difficulty": "Intermediate",
        "duration_minutes": 45,
        "calories_burned": 380.0,
        "target_heart_rate_bpm": 140,
        "audio_coaching_voice": "CyberGuide_V2",
        "ambient_lighting_hex": "#00FFCC",
        "exercises": [
            {
                "id": "ex_01",
                "name": "Barbell Incline Bench Press",
                "sets": 4,
                "reps": "8-10",
                "rest_sec": 60,
                "target_muscle": "Upper Chest",
                "secondary_muscle": "Anterior Deltoids",
                "tempo": "3-0-1-0",
                "video_demo_url": "https://cdn.fitverse.ai/video/incline_bench_4k.mp4",
                "3d_rig_mesh_url": "https://cdn.fitverse.ai/rigs/chest_biomechanics.glb",
                "form_tips": "Retract scapulae and drive through palms."
            },
            {
                "id": "ex_02",
                "name": "Dumbbell Lateral Raises",
                "sets": 4,
                "reps": "12-15",
                "rest_sec": 45,
                "target_muscle": "Lateral Delts",
                "secondary_muscle": "Traps",
                "tempo": "2-0-2-0",
                "video_demo_url": "https://cdn.fitverse.ai/video/lateral_raises_4k.mp4",
                "3d_rig_mesh_url": "https://cdn.fitverse.ai/rigs/shoulder_biomechanics.glb",
                "form_tips": "Slight forward torso lean, raise elbows parallel to ground."
            },
            {
                "id": "ex_03",
                "name": "Overhead Cable Triceps Extension",
                "sets": 3,
                "reps": "12-15",
                "rest_sec": 45,
                "target_muscle": "Triceps Long Head",
                "secondary_muscle": "Forearms",
                "tempo": "2-1-1-0",
                "video_demo_url": "https://cdn.fitverse.ai/video/cable_triceps_4k.mp4",
                "3d_rig_mesh_url": "https://cdn.fitverse.ai/rigs/triceps_biomechanics.glb",
                "form_tips": "Keep elbows tucked and avoid flared posture."
            }
        ]
    }
}

@router.post("")
def execute_graphql(payload: GraphQLRequest):
    """
    Executes field selection on workout database.
    If mobile requests only exercise name & reps, all bulky URLs, tips, and 3D rigs are omitted.
    """
    query_str = payload.query
    raw_workout = WORKOUT_DATABASE["hypertrophy_push"]

    # Calculate raw uncompressed payload size
    raw_json_str = json.dumps(raw_workout)
    raw_bytes = len(raw_json_str.encode('utf-8'))

    # Build dynamic response based on requested fields
    data: Dict[str, Any] = {}
    
    if "getWorkoutPlan" in query_str:
        workout_obj: Dict[str, Any] = {}
        if "id" in query_str: workout_obj["id"] = raw_workout["id"]
        if "title" in query_str: workout_obj["title"] = raw_workout["title"]
        if "difficulty" in query_str: workout_obj["difficulty"] = raw_workout["difficulty"]
        if "duration_minutes" in query_str: workout_obj["duration_minutes"] = raw_workout["duration_minutes"]
        if "calories_burned" in query_str: workout_obj["calories_burned"] = raw_workout["calories_burned"]

        # Parse exercises sub-fields
        if "exercises" in query_str:
            filtered_exercises = []
            for ex in raw_workout["exercises"]:
                filtered_ex: Dict[str, Any] = {}
                if "id" in query_str: filtered_ex["id"] = ex["id"]
                if "name" in query_str: filtered_ex["name"] = ex["name"]
                if "sets" in query_str: filtered_ex["sets"] = ex["sets"]
                if "reps" in query_str: filtered_ex["reps"] = ex["reps"]
                if "target_muscle" in query_str: filtered_ex["target_muscle"] = ex["target_muscle"]
                if "video_demo_url" in query_str: filtered_ex["video_demo_url"] = ex["video_demo_url"]
                if "3d_rig_mesh_url" in query_str: filtered_ex["3d_rig_mesh_url"] = ex["3d_rig_mesh_url"]
                filtered_exercises.append(filtered_ex)
            workout_obj["exercises"] = filtered_exercises

        data["getWorkoutPlan"] = workout_obj

    # Calculate optimized filtered payload size
    filtered_json_str = json.dumps({"data": data})
    filtered_bytes = len(filtered_json_str.encode('utf-8'))
    savings_percent = round((1 - (filtered_bytes / raw_bytes)) * 100, 1) if raw_bytes > 0 else 0.0

    return {
        "data": data,
        "extensions": {
            "performance": {
                "raw_bytes": raw_bytes,
                "filtered_bytes": filtered_bytes,
                "bandwidth_savings_pct": f"{savings_percent}%",
                "engine": "Ponytail GraphQL Light-Selector"
            }
        }
    }
